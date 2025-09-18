#include "config.h"

Preferences prefs;
bool configLoaded = false;
// ==================== GLOBALS ====================
DeviceConfig devConfig = {"device_001", "room_101", "bed_a"};

PatientLocation location = {devConfig.roomNumber, devConfig.bedNumber};

BasePatientConfig basePatientConfig = {"patient_001", "Jone Doe",   "m",
                                       "22",          "2022-01-01", location};

// ==================== SMART SAVE HELPERS ====================
void saveStringIfChanged(const char *key, const String &value) {
  prefs.begin("config", false);
  if (prefs.getString(key, "") != value) {
    prefs.putString(key, value);
  }
  prefs.end();
}

void saveBoolIfChanged(const char *key, bool value) {
  prefs.begin("config", false);
  if (prefs.getBool(key, false) != value) {
    prefs.putBool(key, value);
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

// ==================== LOAD CONFIGS FROM NVS ====================
void loadConfigs() {
  prefs.begin("config", true);

  devConfig.deviceId = prefs.getString("deviceId", devConfig.deviceId);
  devConfig.roomNumber = prefs.getString("roomNumber", devConfig.roomNumber);
  devConfig.bedNumber = prefs.getString("bedNumber", devConfig.bedNumber);

  basePatientConfig.id = prefs.getString("id", basePatientConfig.id);
  basePatientConfig.name = prefs.getString("name", basePatientConfig.name);
  basePatientConfig.gender =
      prefs.getString("gender", basePatientConfig.gender);
  basePatientConfig.admissionDate =
      prefs.getString("admissionDate", basePatientConfig.admissionDate);
  basePatientConfig.gender =
      prefs.getString("gender", basePatientConfig.gender);

  configLoaded = true;

  prefs.end();
}
