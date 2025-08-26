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
import kaist.iclab.tracker.listener.AccessibilityListener
import kaist.iclab.tracker.listener.NotificationListener
import kaist.iclab.tracker.permission.Permission
import kaist.iclab.tracker.permission.PermissionState

object PermissionUtils {
  fun getSupportedPermissionGroups(): Array<kaist.iclab.tracker.permission.Permission> =
    Permission.supportedPermissions

  fun combineStates(states: List<PermissionState>): PermissionState {
    if (states.isEmpty()) return PermissionState.NOT_REQUESTED
    if (states.all { it == PermissionState.GRANTED }) return PermissionState.GRANTED
    if (states.any { it == PermissionState.PERMANENTLY_DENIED }) return PermissionState.PERMANENTLY_DENIED
    if (states.any { it == PermissionState.RATIONALE_REQUIRED }) return PermissionState.RATIONALE_REQUIRED
    return PermissionState.NOT_REQUESTED
  }

  fun getPermissionStateSync(context: Context, activity: ComponentActivity?, permission: String): PermissionState {
    return when (permission) {
      Manifest.permission.PACKAGE_USAGE_STATS -> getPackageUsageStatsPermissionState(context)
      Manifest.permission.BIND_ACCESSIBILITY_SERVICE -> getBindAccessibilityServicePermissionState(context)
      Manifest.permission.BIND_NOTIFICATION_LISTENER_SERVICE -> getBindNotificationListenerServicePermissionState(context)
      else -> getRuntimePermissionState(context, activity, permission)
    }
  }

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
