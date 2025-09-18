
#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>
#include <Preferences.h>

#define QUEUE_LENGTH 10
#define QUEUE_ITEM_SIZE sizeof(DeviceReading)

#define WIFI_SSID ""
#define WIFI_PASSWORD ""
#define WIFI_TIMEOUT_MS 30000

#define API_KEY ""
#define USER_EMAIL ""
#define USER_PASSWORD ""
#define FIREBASE_PROJECT_ID ""
#define AUTH_EXPIRE_PERIOD 3000

#define VITAL_READING_INTERVAL_MS 1000 // 1 second for testing
#define DEBUG_VITALS true
#define DEBUG_FIREBASE true

extern Preferences prefs;
extern bool configLoaded;
extern bool roomCreated;
extern bool basePatientCreated;

// ==================== STRUCTS ====================
struct DeviceConfig {
  String deviceId;
  String roomNumber;
  String bedNumber;
};

struct PatientLocation {
  String roomNumber;
  String bedNumber;
};

struct BasePatientConfig {
  String id;
  String name;
  String gender;
  String age;
  String admissionDate;
  PatientLocation location;
};

// ==================== GLOBAL VARIABLES ====================
extern BasePatientConfig basePatientConfig;
extern DeviceConfig devConfig;
extern Preferences prefs;

// ==================== SMART SAVE HELPERS ====================
void saveStringIfChanged(const char *key, const String &value);
void saveBoolIfChanged(const char *key, bool value);

// ==================== CONFIG UPDATE FUNCTIONS ====================
// DeviceConfig
void updateDeviceId(const String &value);
void updateRoomNumber(const String &value);
void updateBedNumber(const String &value);
void updatePatientId(const String &value);
void updateRoomCreated(bool value);

// ==================== INITIALIZATION ====================
void loadConfigs();

#endif
