package expo.modules.androidtrackerlib

import android.content.Context
import android.content.pm.PackageManager
import android.location.LocationManager
import android.provider.Settings
import android.app.usage.UsageStatsManager
import androidx.core.content.ContextCompat

/**
 * Utility object for managing AAR-specific sensors in the tracker application.
 * 
 * This object provides methods to check availability, start, stop, and monitor the status
 * of various AAR (Android Archive) sensors. Unlike hardware sensors, these sensors are
 * implemented through the AAR library and provide access to system-level data and services.
 * 
 * The SensorUtils manages the following AAR sensors:
 * - ambient_light: Ambient light sensor data
 * - app_usage_log: Application usage statistics
 * - battery: Battery status and monitoring
 * - bluetooth_scan: Bluetooth device scanning
 * - call_log: Call history and logs
 * - data_traffic_stat: Network data usage statistics
 * - location: GPS and location tracking
 * - message_log: SMS and message logs
 * - notification: System notification monitoring
 * - screen: Screen state and activity monitoring
 * - user_interaction: User touch and gesture tracking
 * - wifi_scan: WiFi network scanning
 * 
 * Each sensor can be started, stopped, and monitored for its current status.
 */
object SensorUtils {
  // Track active sensors
  private val activeSensors = mutableMapOf<String, Any>()

  // AAR-specific sensor keys
  private val AAR_SENSORS = listOf(
    "ambient_light",
    "app_usage_log", 
    "battery",
    "bluetooth_scan",
    "call_log",
    "data_traffic_stat",
    "location",
    "message_log",
    "notification",
    "screen",
    "user_interaction",
    "wifi_scan"
  )

  /**
   * Retrieves the list of all available AAR sensors and their availability status.
   * 
   * This function checks each AAR sensor to determine if it's available on the current
   * device. The availability check varies by sensor type:
   * - Some sensors are always available (ambient_light, battery, etc.)
   * - Some require specific hardware features (bluetooth_scan, wifi_scan)
   * - Some require system services to be accessible (app_usage_log, location)
   * 
   * @param context The application context for checking sensor availability
   * @return List of maps containing sensor information with keys: "key", "available", "state"
   * 
   * @example
   * ```kotlin
   * val availableSensors = SensorUtils.getAvailableSensors(context)
   * availableSensors.forEach { sensor ->
   *   println("Sensor: ${sensor["key"]} - Available: ${sensor["available"]}")
   * }
   * ```
   */
  fun getAvailableSensors(context: Context): List<Map<String, Any>> {
    val availableSensors = mutableListOf<Map<String, Any>>()
    
    AAR_SENSORS.forEach { sensorKey ->
      val isAvailable = checkSensorAvailability(context, sensorKey)
      availableSensors.add(mapOf(
        "key" to sensorKey,
        "available" to isAvailable,
        "state" to "DISABLED" // Default state
      ))
    }
    
    return availableSensors
  }

  /**
   * Checks if a specific AAR sensor is available on the current device.
   * 
   * This private function performs device-specific checks for each sensor type:
   * - ambient_light: Always available through AAR
   * - app_usage_log: Checks if UsageStatsManager can query statistics
   * - battery: Always available
   * - bluetooth_scan: Checks for Bluetooth hardware feature
   * - call_log: Always available through AAR
   * - data_traffic_stat: Always available through AAR
   * - location: Checks for GPS hardware and enabled status
   * - message_log: Always available through AAR
   * - notification: Always available through AAR
   * - screen: Always available
   * - user_interaction: Always available through AAR
   * - wifi_scan: Checks for WiFi hardware feature
   * 
   * @param context The application context for checking hardware features and services
   * @param sensorKey The sensor key to check availability for
   * @return true if the sensor is available, false otherwise
   * 
   * @example
   * ```kotlin
   * val isLocationAvailable = checkSensorAvailability(context, "location")
   * if (isLocationAvailable) {
   *   // Location sensor can be used
   *   startSensor(context, "location")
   * }
   * ```
   */
  private fun checkSensorAvailability(context: Context, sensorKey: String): Boolean {
    return when (sensorKey) {
      "ambient_light" -> true // Always available through AAR
      "app_usage_log" -> {
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val currentTime = System.currentTimeMillis()
        val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, currentTime - 86400000, currentTime)
        stats.size > 0 // If we can query stats, the service is available
      }
      "battery" -> true // Always available
      "bluetooth_scan" -> {
        context.packageManager.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH)
      }
      "call_log" -> true // Always available through AAR
      "data_traffic_stat" -> true // Always available through AAR
      "location" -> {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        val hasGps = context.packageManager.hasSystemFeature(PackageManager.FEATURE_LOCATION_GPS)
        val gpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
        hasGps && gpsEnabled
      }
      "message_log" -> true // Always available through AAR
      "notification" -> true // Always available through AAR
      "screen" -> true // Always available
      "user_interaction" -> true // Always available through AAR
      "wifi_scan" -> {
        context.packageManager.hasSystemFeature(PackageManager.FEATURE_WIFI)
      }
      else -> false
    }
  }

  /**
   * Starts a specific AAR sensor and registers it as active.
   * 
   * This function activates an AAR sensor and adds it to the internal tracking system.
   * Each sensor type has specific activation logic:
   * - Most sensors are simply registered as active (AAR handles the actual implementation)
   * - Location sensor checks if GPS provider is enabled before activation
   * - All sensors are stored in the activeSensors map for status tracking
   * 
   * The function returns a map with the following structure:
   * - "success": Boolean indicating if the sensor was started successfully
   * - "message": Human-readable message describing the result
   * - "data": Additional data about the activation (usually "AAR sensor activated")
   * 
   * @param context The application context for sensor activation
   * @param sensorKey The sensor key to start
   * @return Map containing the result of the sensor activation attempt
   * 
   * @example
   * ```kotlin
   * val result = SensorUtils.startSensor(context, "battery")
   * if (result["success"] == true) {
   *   println("Battery monitoring started: ${result["message"]}")
   * } else {
   *   println("Failed to start battery monitoring: ${result["message"]}")
   * }
   * ```
   */
  fun startSensor(context: Context, sensorKey: String): Map<String, Any> {
    return when (sensorKey) {
      "ambient_light" -> {
        try {
          activeSensors[sensorKey] = "Ambient Light Sensor"
          mapOf("success" to true, "message" to "Ambient light sensor started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting ambient light sensor: ${e.message}")
        }
      }
      "app_usage_log" -> {
        try {
          activeSensors[sensorKey] = "App Usage Log"
          mapOf("success" to true, "message" to "App usage log started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting app usage log: ${e.message}")
        }
      }
      "battery" -> {
        try {
          activeSensors[sensorKey] = "Battery Monitor"
          mapOf("success" to true, "message" to "Battery monitoring started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting battery monitoring: ${e.message}")
        }
      }
      "bluetooth_scan" -> {
        try {
          activeSensors[sensorKey] = "Bluetooth Scanner"
          mapOf("success" to true, "message" to "Bluetooth scanning started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting bluetooth scanning: ${e.message}")
        }
      }
      "call_log" -> {
        try {
          activeSensors[sensorKey] = "Call Log Monitor"
          mapOf("success" to true, "message" to "Call log monitoring started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting call log monitoring: ${e.message}")
        }
      }
      "data_traffic_stat" -> {
        try {
          activeSensors[sensorKey] = "Data Traffic Monitor"
          mapOf("success" to true, "message" to "Data traffic monitoring started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting data traffic monitoring: ${e.message}")
        }
      }
      "location" -> {
        try {
          val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
          if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            activeSensors[sensorKey] = "Location Tracker"
            mapOf("success" to true, "message" to "Location tracking started", "data" to "AAR sensor activated")
          } else {
            mapOf("success" to false, "message" to "GPS provider not enabled")
          }
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting location tracking: ${e.message}")
        }
      }
      "message_log" -> {
        try {
          activeSensors[sensorKey] = "Message Log Monitor"
          mapOf("success" to true, "message" to "Message log monitoring started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting message log monitoring: ${e.message}")
        }
      }
      "notification" -> {
        try {
          activeSensors[sensorKey] = "Notification Monitor"
          mapOf("success" to true, "message" to "Notification monitoring started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting notification monitoring: ${e.message}")
        }
      }
      "screen" -> {
        try {
          activeSensors[sensorKey] = "Screen Monitor"
          mapOf("success" to true, "message" to "Screen monitoring started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting screen monitoring: ${e.message}")
        }
      }
      "user_interaction" -> {
        try {
          activeSensors[sensorKey] = "User Interaction Monitor"
          mapOf("success" to true, "message" to "User interaction monitoring started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting user interaction monitoring: ${e.message}")
        }
      }
      "wifi_scan" -> {
        try {
          activeSensors[sensorKey] = "WiFi Scanner"
          mapOf("success" to true, "message" to "WiFi scanning started", "data" to "AAR sensor activated")
        } catch (e: Exception) {
          mapOf("success" to false, "message" to "Error starting WiFi scanning: ${e.message}")
        }
      }
      else -> mapOf("success" to false, "message" to "Unknown sensor: $sensorKey")
    }
  }

  /**
   * Stops a specific AAR sensor and removes it from active tracking.
   * 
   * This function deactivates an AAR sensor and removes it from the internal tracking system.
   * The sensor is removed from the activeSensors map, effectively marking it as inactive.
   * 
   * The function returns a map with the following structure:
   * - "success": Boolean indicating if the sensor was stopped successfully
   * - "message": Human-readable message describing the result
   * - "data": Additional data about the deactivation (usually "AAR sensor deactivated")
   * 
   * @param sensorKey The sensor key to stop
   * @return Map containing the result of the sensor deactivation attempt
   * 
   * @example
   * ```kotlin
   * val result = SensorUtils.stopSensor("battery")
   * if (result["success"] == true) {
   *   println("Battery monitoring stopped: ${result["message"]}")
   * } else {
   *   println("Failed to stop battery monitoring: ${result["message"]}")
   * }
   * ```
   */
  fun stopSensor(sensorKey: String): Map<String, Any> {
    return if (AAR_SENSORS.contains(sensorKey)) {
      try {
        activeSensors.remove(sensorKey)
        val sensorName = getSensorDisplayName(sensorKey)
        mapOf("success" to true, "message" to "$sensorName stopped", "data" to "AAR sensor deactivated")
      } catch (e: Exception) {
        mapOf("success" to false, "message" to "Error stopping $sensorKey: ${e.message}")
      }
    } else {
      mapOf("success" to false, "message" to "Unknown sensor: $sensorKey")
    }
  }

  /**
   * Gets the current status of a specific AAR sensor.
   * 
   * This function checks if a sensor is currently active and returns its status information.
   * The status includes whether the sensor is active, its display name, and a last update indicator.
   * 
   * The function returns a map with the following structure:
   * - "active": Boolean indicating if the sensor is currently active
   * - "name": Human-readable name of the sensor
   * - "lastUpdate": String indicating the last update status ("Active" or "Inactive")
   * 
   * @param sensorKey The sensor key to get status for
   * @return Map containing the current status of the sensor
   * 
   * @example
   * ```kotlin
   * val status = SensorUtils.getSensorStatus("battery")
   * println("Battery sensor: ${status["name"]} - Active: ${status["active"]}")
   * if (status["active"] == true) {
   *   println("Battery monitoring is currently running")
   * }
   * ```
   */
  fun getSensorStatus(sensorKey: String): Map<String, Any> {
    val isActive = activeSensors.containsKey(sensorKey)
    val sensorName = getSensorDisplayName(sensorKey)
    
    return mapOf(
      "active" to isActive,
      "name" to sensorName,
      "lastUpdate" to if (isActive) "Active" else "Inactive"
    )
  }

  /**
   * Gets the status of all AAR sensors in a single call.
   * 
   * This function returns the status of all supported AAR sensors, whether they are active
   * or not. This is useful for getting an overview of all sensor states at once.
   * 
   * The function returns a list of maps, where each map contains:
   * - "key": The sensor key identifier
   * - "active": Boolean indicating if the sensor is currently active
   * - "status": String status ("RUNNING" or "STOPPED")
   * 
   * @return List of maps containing the status of all AAR sensors
   * 
   * @example
   * ```kotlin
   * val allStatus = SensorUtils.getAllSensorStatus()
   * allStatus.forEach { sensorStatus ->
   *   val sensorKey = sensorStatus["key"] as String
   *   val isActive = sensorStatus["active"] as Boolean
   *   val status = sensorStatus["status"] as String
   *   println("$sensorKey: $status")
   * }
   * 
   * // Count active sensors
   * val activeCount = allStatus.count { it["active"] == true }
   * println("Active sensors: $activeCount")
   * ```
   */
  fun getAllSensorStatus(): List<Map<String, Any>> {
    return AAR_SENSORS.map { sensorKey ->
      val isActive = activeSensors.containsKey(sensorKey)
      mapOf(
        "key" to sensorKey,
        "active" to isActive,
        "status" to if (isActive) "RUNNING" else "STOPPED"
      )
    }
  }

  /**
   * Checks if the required permissions are granted for a specific AAR sensor.
   * 
   * This function determines what permissions are needed for a sensor to function properly
   * and checks if those permissions are currently granted. Different sensors require different
   * permissions:
   * - location, wifi_scan, bluetooth_scan: Require location permissions
   * - call_log: Requires READ_CALL_LOG permission
   * - message_log: Requires READ_SMS permission
   * - app_usage_log: Requires PACKAGE_USAGE_STATS permission
   * - notification: Requires notification listener service permission
   * - Others: No special permissions required
   * 
   * The function returns a map with the following structure:
   * - "granted": Boolean indicating if all required permissions are granted
   * - "permissions": List of all required permissions for the sensor
   * - "grantedPermissions": List of permissions that are currently granted
   * 
   * @param context The application context for permission checking
   * @param sensorKey The sensor key to check permissions for
   * @return Map containing permission information for the sensor
   * 
   * @example
   * ```kotlin
   * val permissionInfo = SensorUtils.checkSensorPermission(context, "location")
   * if (permissionInfo["granted"] == true) {
   *   // Can start location sensor
   *   startSensor(context, "location")
   * } else {
   *   // Need to request permissions first
   *   val requiredPermissions = permissionInfo["permissions"] as List<String>
   *   println("Need to grant: ${requiredPermissions.joinToString()}")
   * }
   * ```
   */
  fun checkSensorPermission(context: Context, sensorKey: String): Map<String, Any> {
    val requiredPermissions = when (sensorKey) {
      "location", "wifi_scan", "bluetooth_scan" -> arrayOf(
        android.Manifest.permission.ACCESS_FINE_LOCATION,
        android.Manifest.permission.ACCESS_COARSE_LOCATION
      )
      "call_log" -> arrayOf(
        android.Manifest.permission.READ_CALL_LOG
      )
      "message_log" -> arrayOf(
        android.Manifest.permission.READ_SMS
      )
      "app_usage_log" -> arrayOf(
        android.Manifest.permission.PACKAGE_USAGE_STATS
      )
      "notification" -> arrayOf(
        "BIND_NOTIFICATION_LISTENER_SERVICE" // Special permission
      )
      else -> emptyArray<String>()
    }
    
    if (requiredPermissions.isEmpty()) {
      return mapOf("granted" to true, "permissions" to emptyList<String>())
    } else {
      val grantedPermissions = requiredPermissions.filter { permission ->
        if (permission == "BIND_NOTIFICATION_LISTENER_SERVICE") {
          // Check notification listener service permission
          val enabledNotificationListeners = Settings.Secure.getString(
            context.contentResolver,
            "enabled_notification_listeners"
          )
          enabledNotificationListeners?.contains(context.packageName) == true
        } else {
          android.content.pm.PackageManager.PERMISSION_GRANTED == 
            ContextCompat.checkSelfPermission(context, permission)
        }
      }
      return mapOf(
        "granted" to (grantedPermissions.size == requiredPermissions.size),
        "permissions" to requiredPermissions.toList(),
        "grantedPermissions" to grantedPermissions
      )
    }
  }

  /**
   * Converts a sensor key to its human-readable display name.
   * 
   * This private helper function provides a mapping from sensor keys to user-friendly
   * display names. It's used internally by other functions to provide consistent
   * naming across the application.
   * 
   * @param sensorKey The sensor key to convert to display name
   * @return Human-readable display name for the sensor
   * 
   * @example
   * ```kotlin
   * val displayName = getSensorDisplayName("ambient_light")
   * // Returns: "Ambient Light"
   * 
   * val displayName2 = getSensorDisplayName("app_usage_log")
   * // Returns: "App Usage Log"
   * ```
   */
  private fun getSensorDisplayName(sensorKey: String): String {
    return when (sensorKey) {
      "ambient_light" -> "Ambient Light"
      "app_usage_log" -> "App Usage Log"
      "battery" -> "Battery"
      "bluetooth_scan" -> "Bluetooth Scan"
      "call_log" -> "Call Log"
      "data_traffic_stat" -> "Data Traffic"
      "location" -> "Location"
      "message_log" -> "Message Log"
      "notification" -> "Notification"
      "screen" -> "Screen"
      "user_interaction" -> "User Interaction"
      "wifi_scan" -> "WiFi Scan"
      else -> "Unknown"
    }
  }
}
