
#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>
#include <Preferences.h>

#define QUEUE_LENGTH 10
#define QUEUE_ITEM_SIZE sizeof(DeviceReading)

#define WIFI_SSID "Loto2"
#define WIFI_PASSWORD "LotoWifi2"
#define WIFI_TIMEOUT_MS 30000

#define API_KEY "AIzaSyABA5ZxXkbk8ea3uyZwu8VHAuBxThojGOY"
#define USER_EMAIL "iqbalfirdaus05@gmail.com"
#define USER_PASSWORD "LotoFirebase12"
#define FIREBASE_PROJECT_ID "ward-monitor"
#define AUTH_EXPIRE_PERIOD 3000

#define VITAL_READING_INTERVAL_MS 1000 // 1 second for testing
#define DEBUG_VITALS true
#define DEBUG_FIREBASE true

extern Preferences prefs;
extern bool configLoaded;

// ==================== STRUCTS ====================

struct DeviceConfig {
  String deviceId;
  String roomNumber;
  String bedNumber;
  String patientId;
};

// ==================== GLOBAL VARIABLES ====================
extern DeviceConfig devConfig;
extern Preferences prefs;

// ==================== SMART SAVE HELPERS ====================
void saveStringIfChanged(const char *key, const String &value);

// ==================== CONFIG UPDATE FUNCTIONS ====================
// DeviceConfig
void updateDeviceId(const String &value);
void updateRoomNumber(const String &value);
void updateBedNumber(const String &value);
void updatePatientId(const String &value);

// ==================== INITIALIZATION ====================
void loadConfigs();

#endif
