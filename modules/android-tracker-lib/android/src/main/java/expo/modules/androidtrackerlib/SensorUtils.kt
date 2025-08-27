package expo.modules.androidtrackerlib

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorManager
import android.location.LocationManager
import android.content.pm.PackageManager

object SensorUtils {
  // Track active sensors
  private val activeSensors = mutableMapOf<String, Any>()

  fun getAvailableSensors(context: Context): List<Map<String, Any>> {
    val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    val availableSensors = mutableListOf<Map<String, Any>>()
    
    // Check for common sensors
    val sensors = listOf(
      "accel" to Sensor.TYPE_ACCELEROMETER,
      "gyro" to Sensor.TYPE_GYROSCOPE,
      "gps" to -1, // GPS is handled by LocationSensor
      "heart" to Sensor.TYPE_HEART_RATE,
      "temp" to Sensor.TYPE_AMBIENT_TEMPERATURE
    )
    
    sensors.forEach { (key, sensorType) ->
      if (sensorType == -1) {
        // Special handling for GPS
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        val hasGps = context.packageManager.hasSystemFeature(PackageManager.FEATURE_LOCATION_GPS)
        val gpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
        availableSensors.add(mapOf(
          "key" to key,
          "available" to (hasGps && gpsEnabled),
          "state" to "DISABLED" // Default state
        ))
      } else {
        val sensor = sensorManager.getDefaultSensor(sensorType)
        availableSensors.add(mapOf(
          "key" to key,
          "available" to (sensor != null),
          "state" to "DISABLED" // Default state
        ))
      }
    }
    
    return availableSensors
  }

  fun startSensor(context: Context, sensorKey: String): Map<String, Any> {
    if (sensorKey == "accel") {
      try {
        val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        if (accelerometer != null) {
          activeSensors[sensorKey] = accelerometer
          return mapOf("success" to true, "message" to "Accelerometer started", "data" to "Sensor registered")
        } else {
          return mapOf("success" to false, "message" to "Accelerometer not available")
        }
      } catch (e: Exception) {
        return mapOf("success" to false, "message" to "Error starting accelerometer: ${e.message}")
      }
    } else if (sensorKey == "gyro") {
      try {
        val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
        if (gyroscope != null) {
          activeSensors[sensorKey] = gyroscope
          return mapOf("success" to true, "message" to "Gyroscope started", "data" to "Sensor registered")
        } else {
          return mapOf("success" to false, "message" to "Gyroscope not available")
        }
      } catch (e: Exception) {
        return mapOf("success" to false, "message" to "Error starting gyroscope: ${e.message}")
      }
    } else if (sensorKey == "gps") {
      try {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
          activeSensors[sensorKey] = "GPS"
          return mapOf("success" to true, "message" to "GPS started", "data" to "Location provider enabled")
        } else {
          return mapOf("success" to false, "message" to "GPS provider not enabled")
        }
      } catch (e: Exception) {
        return mapOf("success" to false, "message" to "Error starting GPS: ${e.message}")
      }
    } else if (sensorKey == "heart") {
      try {
        val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val heartRate = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE)
        if (heartRate != null) {
          activeSensors[sensorKey] = heartRate
          return mapOf("success" to true, "message" to "Heart rate sensor started", "data" to "Sensor registered")
        } else {
          return mapOf("success" to false, "message" to "Heart rate sensor not available")
        }
      } catch (e: Exception) {
        return mapOf("success" to false, "message" to "Error starting heart rate sensor: ${e.message}")
      }
    } else if (sensorKey == "temp") {
      try {
        val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val temperature = sensorManager.getDefaultSensor(Sensor.TYPE_AMBIENT_TEMPERATURE)
        if (temperature != null) {
          activeSensors[sensorKey] = temperature
          return mapOf("success" to true, "message" to "Temperature sensor started", "data" to "Sensor registered")
        } else {
          return mapOf("success" to false, "message" to "Temperature sensor not available")
        }
      } catch (e: Exception) {
        return mapOf("success" to false, "message" to "Error starting temperature sensor: ${e.message}")
      }
    } else {
      return mapOf("success" to false, "message" to "Unknown sensor: $sensorKey")
    }
  }

  fun stopSensor(sensorKey: String): Map<String, Any> {
    if (sensorKey == "accel" || sensorKey == "gyro" || sensorKey == "heart" || sensorKey == "temp") {
      try {
        activeSensors.remove(sensorKey)
        return mapOf("success" to true, "message" to "${sensorKey.capitalize()} stopped", "data" to "Sensor unregistered")
      } catch (e: Exception) {
        return mapOf("success" to false, "message" to "Error stopping ${sensorKey}: ${e.message}")
      }
    } else if (sensorKey == "gps") {
      try {
        activeSensors.remove(sensorKey)
        return mapOf("success" to true, "message" to "GPS stopped", "data" to "Location provider disabled")
      } catch (e: Exception) {
        return mapOf("success" to false, "message" to "Error stopping GPS: ${e.message}")
      }
    } else {
      return mapOf("success" to false, "message" to "Unknown sensor: $sensorKey")
    }
  }

  fun getSensorStatus(sensorKey: String): Map<String, Any> {
    val isActive = activeSensors.containsKey(sensorKey)
    val sensorInfo = when (sensorKey) {
      "accel" -> "Accelerometer"
      "gyro" -> "Gyroscope"
      "gps" -> "GPS"
      "heart" -> "Heart Rate"
      "temp" -> "Temperature"
      else -> "Unknown"
    }
    
    return mapOf(
      "active" to isActive,
      "name" to sensorInfo,
      "lastUpdate" to if (isActive) "Active" else "Inactive"
    )
  }

  fun getAllSensorStatus(): List<Map<String, Any>> {
    val allSensors = listOf("accel", "gyro", "gps", "heart", "temp")
    return allSensors.map { sensorKey ->
      val isActive = activeSensors.containsKey(sensorKey)
      mapOf(
        "key" to sensorKey,
        "active" to isActive,
        "status" to if (isActive) "RUNNING" else "STOPPED"
      )
    }
  }

  fun checkSensorPermission(context: Context, sensorKey: String): Map<String, Any> {
    val requiredPermissions = when (sensorKey) {
      "gps" -> arrayOf(
        android.Manifest.permission.ACCESS_FINE_LOCATION,
        android.Manifest.permission.ACCESS_COARSE_LOCATION
      )
      "heart" -> arrayOf(
        android.Manifest.permission.BODY_SENSORS
      )
      else -> emptyArray<String>()
    }
    
    if (requiredPermissions.isEmpty()) {
      return mapOf("granted" to true, "permissions" to emptyList<String>())
    } else {
      val grantedPermissions = requiredPermissions.filter { permission ->
        android.content.pm.PackageManager.PERMISSION_GRANTED == 
          androidx.core.content.ContextCompat.checkSelfPermission(context, permission)
      }
      return mapOf(
        "granted" to (grantedPermissions.size == requiredPermissions.size),
        "permissions" to requiredPermissions.toList(),
        "grantedPermissions" to grantedPermissions
      )
    }
  }
}
