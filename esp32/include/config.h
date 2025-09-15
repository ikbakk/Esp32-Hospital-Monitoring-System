#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// ==================== WIFI CONFIGURATION ====================
#define WIFI_SSID "Loto2"
#define WIFI_PASSWORD "LotoWifi2"
#define WIFI_TIMEOUT_MS 30000

// ==================== FIREBASE CONFIGURATION ====================
#define API_KEY "AIzaSyABA5ZxXkbk8ea3uyZwu8VHAuBxThojGOY"
#define USER_EMAIL "iqbalfirdaus05@gmail.com"
#define USER_PASSWORD "LotoFirebase12"
#define FIREBASE_PROJECT_ID "ward-monitor"
#define AUTH_EXPIRE_PERIOD 3000 // seconds (<3600)

// ==================== DEVICE CONFIGURATION ====================
#define DEVICE_ID "esp32_monitor_001"
#define DEFAULT_ROOM_NUMBER "101"
#define DEFAULT_BED_NUMBER "A"

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
extern const String bedNumber;
