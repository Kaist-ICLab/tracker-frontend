package expo.modules.androidtrackerlib

import androidx.activity.ComponentActivity
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Import from Android Tracker AAR File
import kaist.iclab.tracker.permission.Permission
import kaist.iclab.tracker.permission.PermissionManagerImpl

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
    Function("getUserPermissions") {
      val permissionManager = getPermissionManager()
      val permissionIds = Permission.supportedPermissions.flatMap { it.ids.toList() }.toTypedArray()
      permissionManager.getPermissionFlow(permissionIds).value.any { (permission) ->
        permissionIds.contains(permission)
      }
    }

    Function("requestPermission") { permissionKey: String ->
      getPermissionManager().request(arrayOf(permissionKey))
    }
  }
}
