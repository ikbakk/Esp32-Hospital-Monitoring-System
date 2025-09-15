#pragma once
#include <Arduino.h>

// ==================== VITAL SIGNS ====================
struct VitalSigns {
  float heartRate;
  float spo2;
  float bodyTemp;
};

// ==================== DEVICE READING ====================
struct DeviceReading {
  String id;
  VitalSigns vitalSigns;
  String timestamp;
  String deviceId;
  String roomNumber;
  String bedNumber;
};

// ==================== UTILITY FUNCTIONS ====================
String getCurrentTimestamp();
DeviceReading generateRandomReading();
