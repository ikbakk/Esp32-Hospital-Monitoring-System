#pragma once
#include <config.h>

struct SensorReading {
  float heartRate;
  float spo2;
  float bodyTemp;
  unsigned long timestamp;
  bool isValid;
};

struct NetworkData {
  SensorReading readings[10]; // Batch upload
  int count;
};

extern QueueHandle_t sensorQueue;
extern SemaphoreHandle_t i2cMutex;
extern TaskHandle_t sensorTaskHandle;
extern TaskHandle_t networkTaskHandle;
extern TaskHandle_t watchdogTaskHandle;

// extern MAX30105 particleSensor;
// extern Adafruit_MLX90614 mlx;

// HR calculation variables
extern const byte RATE_SIZE;
extern int rateIndex;
extern long lastBeat;
extern long total;
extern int beatsPerMinute;

// Network status
extern bool wifiConnected;
extern unsigned long lastNetworkCheck;
extern unsigned long lastSensorReading;
extern unsigned long lastUpload;

void setupWiFi();
void setupSensors();
void setupTasks();
String getISOTimestamp();
bool uploadToSupabase(const SensorReading *readings, int count);
void sensorTask(void *parameter);
void networkTask(void *parameter);
void watchdogTask(void *parameter);
SensorReading takeSensorReading();
void printSystemInfo();
