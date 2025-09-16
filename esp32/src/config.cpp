#include "config.h"

Preferences prefs;
bool configLoaded = false;
// ==================== GLOBALS ====================
DeviceConfig devConfig = {"Device_001", "Room_001", "Bed_001", "Patient_001"};

// ==================== SMART SAVE HELPERS ====================
void saveStringIfChanged(const char *key, const String &value) {
  prefs.begin("config", false);
  if (prefs.getString(key, "") != value) {
    prefs.putString(key, value);
  }
  prefs.end();
}

// ==================== DEVICE CONFIG UPDATES ====================
void updateDeviceId(const String &value) {
  if (devConfig.deviceId != value) {
    devConfig.deviceId = value;
    saveStringIfChanged("deviceId", value);
  }
}

void updateRoomNumber(const String &value) {
  if (devConfig.roomNumber != value) {
    devConfig.roomNumber = value;
    saveStringIfChanged("roomNumber", value);
  }
}

void updateBedNumber(const String &value) {
  if (devConfig.bedNumber != value) {
    devConfig.bedNumber = value;
    saveStringIfChanged("bedNumber", value);
  }
}

void updatePatientId(const String &value) {
  if (devConfig.patientId != value) {
    devConfig.patientId = value;
    saveStringIfChanged("patientId", value);
  }
}

// ==================== LOAD CONFIGS FROM NVS ====================
void loadConfigs() {
  prefs.begin("config", true);

  devConfig.deviceId = prefs.getString("deviceId", devConfig.deviceId);
  devConfig.roomNumber = prefs.getString("roomNumber", devConfig.roomNumber);
  devConfig.bedNumber = prefs.getString("bedNumber", devConfig.bedNumber);
  devConfig.patientId = prefs.getString("patientId", devConfig.patientId);

  configLoaded = true;

  prefs.end();
}
