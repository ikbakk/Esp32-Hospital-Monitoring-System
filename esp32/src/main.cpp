#include <globals.h>

QueueHandle_t sensorQueue;
SemaphoreHandle_t i2cMutex;
TaskHandle_t sensorTaskHandle;
TaskHandle_t networkTaskHandle;
TaskHandle_t watchdogTaskHandle;

unsigned long lastNetworkCheck = 0;
unsigned long lastSensorReading = 0;
unsigned long lastUpload = 0;

void setup() {
  Serial.begin(SERIAL_BAUD_RATE);

  printSystemInfo();
  Serial.println("=== ESP32 Medical Monitoring System ===");
  Serial.println("Initializing...");

  Wire.begin(SDA_PIN, SCL_PIN);

  i2cMutex = xSemaphoreCreateMutex();
  if (i2cMutex == NULL) {
    Serial.println("ERROR: Failed to create I2C mutex!");
    ESP.restart();
  }

  sensorQueue = xQueueCreate(MAX_QUEUE_SIZE, sizeof(SensorReading));
  if (sensorQueue == NULL) {
    Serial.println("ERROR: Failed to create sensor queue!");
    ESP.restart();
  }

  setupWiFi();
  setupSensors();
  setupTasks();
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  Serial.println("System initialized successfully!");
}

void loop() {
  delay(10000);

  // Print system status every 10 seconds
  static unsigned long lastStatus = 0;
  if (millis() - lastStatus > 10000) {
    Serial.printf("Free heap: %d bytes | Queue items: %d\n", ESP.getFreeHeap(),
                  uxQueueMessagesWaiting(sensorQueue));
    lastStatus = millis();
  }

  handleSerialCommands();
}
