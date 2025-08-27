package expo.modules.androidtrackerlib

import android.Manifest
import android.app.AppOpsManager
import android.app.NotificationManager
import android.content.ComponentName
import android.content.Context
import android.os.Build
import android.provider.Settings
import android.text.TextUtils
import android.view.accessibility.AccessibilityManager
import androidx.activity.ComponentActivity
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat

// Access from the AAR File
import kaist.iclab.tracker.listener.AccessibilityListener
import kaist.iclab.tracker.listener.NotificationListener
import kaist.iclab.tracker.permission.Permission
import kaist.iclab.tracker.permission.PermissionState

/**
 * Utility object for handling Android permissions in the tracker application.
 * 
 * This object provides methods to check, validate, and manage various types of Android permissions
 * including runtime permissions, special permissions (like usage stats), and service permissions
 * (like accessibility and notification listener services).
 * 
 * The PermissionUtils handles the following permission types:
 * - Runtime permissions (location, call log, SMS, etc.)
 * - Package usage stats permission
 * - Accessibility service permission
 * - Notification listener service permission
 */
object PermissionUtils {
  
  /**
   * Retrieves the list of all supported permission groups for the tracker application.
   * 
   * This function returns an array of Permission objects that define all the permission groups
   * that the application can request from users. Each Permission object contains information
   * about the permission group including its key, name, description, and associated permission IDs.
   * 
   * @return Array of Permission objects representing all supported permission groups
   * 
   * @example
   * ```kotlin
   * val permissions = PermissionUtils.getSupportedPermissionGroups()
   * permissions.forEach { permission ->
   *   println("Permission: ${permission.name} - ${permission.description}")
   * }
   * ```
   */
  fun getSupportedPermissionGroups(): Array<kaist.iclab.tracker.permission.Permission> =
    Permission.supportedPermissions

  /**
   * Combines multiple permission states into a single representative state.
   * 
   * This function takes a list of individual permission states and determines the overall
   * permission state based on the following priority rules:
   * - If any permission is PERMANENTLY_DENIED, the result is PERMANENTLY_DENIED
   * - If any permission requires rationale, the result is RATIONALE_REQUIRED
   * - If all permissions are GRANTED, the result is GRANTED
   * - Otherwise, the result is NOT_REQUESTED
   * 
   * This is useful when a feature requires multiple permissions and you need to determine
   * the overall permission status for that feature.
   * 
   * @param states List of individual permission states to combine
   * @return Combined PermissionState representing the overall permission status
   * 
   * @example
   * ```kotlin
   * val locationStates = listOf(
   *   PermissionState.GRANTED,      // ACCESS_FINE_LOCATION
   *   PermissionState.GRANTED       // ACCESS_COARSE_LOCATION
   * )
   * val combinedState = PermissionUtils.combineStates(locationStates)
   * // Result: PermissionState.GRANTED
   * ```
   */
  fun combineStates(states: List<PermissionState>): PermissionState {
    if (states.isEmpty()) return PermissionState.NOT_REQUESTED
    if (states.all { it == PermissionState.GRANTED }) return PermissionState.GRANTED
    if (states.any { it == PermissionState.PERMANENTLY_DENIED }) return PermissionState.PERMANENTLY_DENIED
    if (states.any { it == PermissionState.RATIONALE_REQUIRED }) return PermissionState.RATIONALE_REQUIRED
    return PermissionState.NOT_REQUESTED
  }

  /**
   * Synchronously checks the current state of a specific permission.
   * 
   * This function provides a unified interface for checking permission states across different
   * permission types. It automatically routes the permission check to the appropriate handler
   * based on the permission type:
   * - PACKAGE_USAGE_STATS: Uses AppOpsManager to check usage stats permission
   * - BIND_ACCESSIBILITY_SERVICE: Checks if accessibility service is enabled
   * - BIND_NOTIFICATION_LISTENER_SERVICE: Checks if notification listener is enabled
   * - All others: Uses standard runtime permission checking
   * 
   * @param context The application context for permission checking
   * @param activity The current activity (required for runtime permission rationale checking)
   * @param permission The permission string to check (e.g., Manifest.permission.ACCESS_FINE_LOCATION)
   * @return PermissionState indicating the current state of the permission
   * 
   * @example
   * ```kotlin
   * val locationState = PermissionUtils.getPermissionStateSync(
   *   context,
   *   activity,
   *   Manifest.permission.ACCESS_FINE_LOCATION
   * )
   * when (locationState) {
   *   PermissionState.GRANTED -> startLocationTracking()
   *   PermissionState.NOT_REQUESTED -> requestLocationPermission()
   *   PermissionState.RATIONALE_REQUIRED -> showPermissionRationale()
   *   PermissionState.PERMANENTLY_DENIED -> openAppSettings()
   * }
   * ```
   */
  fun getPermissionStateSync(context: Context, activity: ComponentActivity?, permission: String): PermissionState {
    return when (permission) {
      Manifest.permission.PACKAGE_USAGE_STATS -> getPackageUsageStatsPermissionState(context)
      Manifest.permission.BIND_ACCESSIBILITY_SERVICE -> getBindAccessibilityServicePermissionState(context)
      Manifest.permission.BIND_NOTIFICATION_LISTENER_SERVICE -> getBindNotificationListenerServicePermissionState(context)
      else -> getRuntimePermissionState(context, activity, permission)
    }
  }

  /**
   * Checks the state of a standard runtime permission.
   * 
   * This function handles the checking of regular Android runtime permissions (permissions
   * that can be requested through the standard permission dialog). It determines the permission
   * state based on the following logic:
   * - GRANTED: Permission is already granted by the user
   * - RATIONALE_REQUIRED: Permission was denied but rationale should be shown before requesting again
   * - NOT_REQUESTED: Permission hasn't been requested yet
   * - PERMANENTLY_DENIED: Permission was denied and "Don't ask again" was selected
   * 
   * @param context The application context for permission checking
   * @param activity The current activity (required for rationale checking)
   * @param permission The runtime permission string to check
   * @return PermissionState indicating the current state of the runtime permission
   * 
   * @example
   * ```kotlin
   * val callLogState = getRuntimePermissionState(
   *   context,
   *   activity,
   *   Manifest.permission.READ_CALL_LOG
   * )
   * ```
   */
  private fun getRuntimePermissionState(context: Context, activity: ComponentActivity?, permission: String): PermissionState {
    activity ?: return PermissionState.NOT_REQUESTED
    return when {
      ContextCompat.checkSelfPermission(context, permission) == android.content.pm.PackageManager.PERMISSION_GRANTED -> {
        PermissionState.GRANTED
      }
      ActivityCompat.shouldShowRequestPermissionRationale(activity, permission) -> {
        PermissionState.RATIONALE_REQUIRED
      }
      ContextCompat.checkSelfPermission(context, permission) == android.content.pm.PackageManager.PERMISSION_DENIED &&
        !ActivityCompat.shouldShowRequestPermissionRationale(activity, permission) -> {
        PermissionState.NOT_REQUESTED
      }
      else -> {
        PermissionState.PERMANENTLY_DENIED
      }
    }
  }

  /**
   * Checks the state of the PACKAGE_USAGE_STATS permission.
   * 
   * This function handles the special PACKAGE_USAGE_STATS permission which is not a standard
   * runtime permission but rather a system-level permission that must be granted through
   * the device's Settings app. It uses AppOpsManager to check if the permission is currently
   * allowed for the application.
   * 
   * The permission allows the app to access usage statistics of other applications,
   * which is useful for tracking app usage patterns and screen time.
   * 
   * @param context The application context for permission checking
   * @return PermissionState.GRANTED if usage stats permission is allowed, NOT_REQUESTED otherwise
   * 
   * @example
   * ```kotlin
   * val usageStatsState = getPackageUsageStatsPermissionState(context)
   * if (usageStatsState == PermissionState.GRANTED) {
   *   // Can access app usage statistics
   *   val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
   *   val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)
   * }
   * ```
   */
  private fun getPackageUsageStatsPermissionState(context: Context): PermissionState {
    val appOpsManager = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      appOpsManager.unsafeCheckOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        android.os.Process.myUid(),
        context.packageName
      )
    } else {
      appOpsManager.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        android.os.Process.myUid(),
        context.packageName
      )
    }
    return if (mode == AppOpsManager.MODE_ALLOWED) PermissionState.GRANTED else PermissionState.NOT_REQUESTED
  }

  /**
   * Checks if the accessibility service is enabled for the application.
   * 
   * This function verifies whether the application's AccessibilityListener service is
   * currently enabled in the system's accessibility settings. The accessibility service
   * allows the app to monitor user interactions and system events for tracking purposes.
   * 
   * The check involves two steps:
   * 1. Verifying that the service is listed in the enabled accessibility services
   * 2. Confirming that the service is actually running and accessible
   * 
   * @param context The application context for service checking
   * @return PermissionState.GRANTED if accessibility service is enabled and running, NOT_REQUESTED otherwise
   * 
   * @example
   * ```kotlin
   * val accessibilityState = getBindAccessibilityServicePermissionState(context)
   * if (accessibilityState == PermissionState.GRANTED) {
   *   // Accessibility service is enabled, can monitor user interactions
   *   startUserInteractionTracking()
   * } else {
   *   // Need to guide user to enable accessibility service in settings
   *   showAccessibilityServiceInstructions()
   * }
   * ```
   */
  private fun getBindAccessibilityServicePermissionState(context: Context): PermissionState {
    val accessibilityManager = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
    val enabledServices = Settings.Secure.getString(
      context.contentResolver,
      Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
    ) ?: return PermissionState.NOT_REQUESTED

    val enabledServicesList = TextUtils.split(enabledServices, ":")
    val fullServiceName = "${context.packageName}/${AccessibilityListener::class.java.canonicalName}"

    val isServiceRunning = accessibilityManager.getEnabledAccessibilityServiceList(
      android.accessibilityservice.AccessibilityServiceInfo.FEEDBACK_ALL_MASK
    ).any { it.id == fullServiceName }

    return if (enabledServicesList.contains(fullServiceName) && isServiceRunning) PermissionState.GRANTED else PermissionState.NOT_REQUESTED
  }

  /**
   * Checks if the notification listener service is enabled for the application.
   * 
   * This function verifies whether the application's NotificationListener service is
   * currently enabled in the system's notification access settings. The notification
   * listener service allows the app to monitor incoming notifications for tracking
   * communication patterns and app usage.
   * 
   * The implementation handles different Android versions:
   * - Android O MR1 (API 27) and above: Uses NotificationManager.isNotificationListenerAccessGranted()
   * - Below Android O MR1: Uses NotificationManagerCompat.getEnabledListenerPackages()
   * 
   * @param context The application context for service checking
   * @return PermissionState.GRANTED if notification listener is enabled, NOT_REQUESTED otherwise
   * 
   * @example
   * ```kotlin
   * val notificationState = getBindNotificationListenerServicePermissionState(context)
   * if (notificationState == PermissionState.GRANTED) {
   *   // Notification listener is enabled, can monitor notifications
   *   startNotificationTracking()
   * } else {
   *   // Need to guide user to enable notification access in settings
   *   showNotificationAccessInstructions()
   * }
   * ```
   */
  private fun getBindNotificationListenerServicePermissionState(context: Context): PermissionState {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      if (notificationManager.isNotificationListenerAccessGranted(ComponentName(context, NotificationListener::class.java))) {
        PermissionState.GRANTED
      } else {
        PermissionState.NOT_REQUESTED
      }
    } else {
      if (NotificationManagerCompat.getEnabledListenerPackages(context).contains(context.packageName)) {
        PermissionState.GRANTED
      } else {
        PermissionState.NOT_REQUESTED
      }
    }
  }
}
