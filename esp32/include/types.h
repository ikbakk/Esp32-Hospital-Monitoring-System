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
  VitalSigns vitalSigns;
};

// ==================== UTILITY FUNCTIONS ====================
DeviceReading generateRandomReading();
