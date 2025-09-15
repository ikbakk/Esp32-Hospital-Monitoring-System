#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// ==================== WIFI CONFIGURATION ====================
#define WIFI_SSID "Loto2"
#define WIFI_PASSWORD "LotoWifi2"
#define WIFI_TIMEOUT_MS 30000

// ==================== FIREBASE CONFIGURATION ====================
#define API_KEY ""
#define USER_EMAIL "@gmail.com"
#define USER_PASSWORD ""
#define FIREBASE_PROJECT_ID "-monitor"
#define AUTH_EXPIRE_PERIOD 3000 // seconds (<3600)

// ==================== DEVICE CONFIGURATION ====================
#define DEVICE_ID "esp32_monitor_001"
#define ROOM_NUMBER "101"
#define BED_NUMBER "A"
#define PATIENT_ID "patient_001"

// ==================== TIMING ====================
#define VITAL_READING_INTERVAL_MS 1000 // 1 second for testing

// ==================== DEBUG ====================
#define DEBUG_VITALS true
#define DEBUG_FIREBASE true

// ==================== COLLECTIONS ====================
#define COLLECTION_READINGS "readings"

// ==================== DEVICE GLOBALS ====================
extern const String deviceId;
extern const String roomNumber;
extern const String patientId;

#endif
