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
  SensorReading readings[10];
  int count;
};

extern QueueHandle_t sensorQueue;
extern SemaphoreHandle_t i2cMutex;
extern TaskHandle_t sensorTaskHandle;
extern TaskHandle_t networkTaskHandle;
extern TaskHandle_t watchdogTaskHandle;

extern PulseOximeter pox;
extern Adafruit_MLX90614 mlx;
extern bool useMock;
extern String mockMode;

// Sensor status tracking
extern bool max30100Connected;
extern bool mlx90614Connected;
extern unsigned long lastSensorCheck;
extern unsigned long sensorCheckInterval;
extern int max30100ErrorCount;
extern int mlx90614ErrorCount;
extern const int maxSensorError;

// MAX30100 data
extern float currentHeartRate;
extern float currentSpO2;
extern unsigned long lastBeatDetected;
extern long lastBeat;

// Network status
extern bool wifiConnected;
extern unsigned long lastNetworkCheck;
extern unsigned long lastSensorReading;
extern unsigned long lastUpload;

void setupWiFi();
void setupSensors();
void setupTasks();

String getISOTimestamp();
void printSystemInfo();
void onBeatDetected();
bool testMAX30100();
bool testMLX90614();
bool checkSensorConnections();
SensorReading generateMockReading(const String &mode);
void handleSerialCommands();

void waitForSensorConnection();
SensorReading takeSensorReading();
bool uploadToSupabase(const SensorReading *readings, int count);

void sensorTask(void *parameter);
void networkTask(void *parameter);
void watchdogTask(void *parameter);
