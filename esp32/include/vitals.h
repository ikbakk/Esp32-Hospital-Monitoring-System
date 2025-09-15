#pragma once
#include <Arduino.h>
#include <types.h>

// Vitals generation and processing
String getCurrentTimestamp();
DeviceReading generateRandomReading(const String &patientId);
