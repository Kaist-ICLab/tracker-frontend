package expo.modules.androidtrackerlib

import androidx.activity.ComponentActivity
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Import from Android Tracker AAR File
import kaist.iclab.tracker.permission.Permission
import kaist.iclab.tracker.permission.PermissionManagerImpl
import kaist.iclab.tracker.permission.PermissionState

class AndroidTrackerLibModule : Module() {
  private val context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  companion object {
    private var permissionManager: PermissionManagerImpl? = null

    fun initPermissionManager(activity: ComponentActivity) {
      permissionManager = PermissionManagerImpl(activity.applicationContext)
      permissionManager!!.bind(activity)
    }

    fun getPermissionManager(): PermissionManagerImpl {
      return permissionManager ?: throw IllegalStateException("PermissionManager not initialized")
    }
  }

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('AndroidTrackerLib')` in JavaScript.
    Name("AndroidTrackerLib")

    // Permission Functions
    // Returns a list of supported permission groups with their metadata and current combined state
    Function("getSupportedPermissions") {
      val groups = PermissionUtils.getSupportedPermissionGroups()

      val result = groups.map { group ->
        val ids = group.ids
        val activity = appContext.currentActivity as? ComponentActivity
        val combinedState = PermissionUtils.combineStates(ids.map { id -> PermissionUtils.getPermissionStateSync(context, activity, id) })
        mapOf(
          "groupKey" to group.name, // use human-readable name as stable key
          "name" to group.name,
          "description" to group.description,
          "ids" to ids.toList(),
          "state" to combinedState.name,
        )
      }
      result
    }

    // Requests a permission group by its groupKey (permission name)
    Function("requestPermissionGroup") { groupKey: String ->
      val group = Permission.supportedPermissions.firstOrNull { it.name == groupKey }
        ?: throw IllegalArgumentException("Unknown permission group: $groupKey")
      getPermissionManager().request(group.ids)
    }

    Function("requestPermission") { permissionKey: String ->
      getPermissionManager().request(arrayOf(permissionKey))
    }

    // Sensor Management Functions
    Function("getAvailableSensors") {
      SensorUtils.getAvailableSensors(context)
    }

    Function("startSensor") { sensorKey: String ->
      SensorUtils.startSensor(context, sensorKey)
    }

    Function("stopSensor") { sensorKey: String ->
      SensorUtils.stopSensor(sensorKey)
    }

    Function("getSensorStatus") { sensorKey: String ->
      SensorUtils.getSensorStatus(sensorKey)
    }

    Function("getAllSensorStatus") {
      SensorUtils.getAllSensorStatus()
    }

    Function("checkSensorPermission") { sensorKey: String ->
      SensorUtils.checkSensorPermission(context, sensorKey)
    }
  }
}
