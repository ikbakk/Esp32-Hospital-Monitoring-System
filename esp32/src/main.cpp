#include <config.h>
#include <firebase.h>
#include <freertos/queue.h>
#include <utils.h>
#include <wifi_setup.h>

bool roomCreated = false;

// ---------------- QUEUE ----------------
QueueHandle_t readingQueue;

// ---------------- TASK HANDLES ----------------
TaskHandle_t taskReadHandle = nullptr;
TaskHandle_t taskUploadHandle = nullptr;

// ---------------- TIMERS ----------------
unsigned long lastReadingTime = 0;

// ==================== TASK: Sensor Reading (Producer) ====================
void taskReadSensors(void *pvParameters) {
  while (true) {
    if (roomCreated) {
      if (millis() - lastReadingTime >= VITAL_READING_INTERVAL_MS) {
        lastReadingTime = millis();

        DeviceReading reading = generateRandomReading();

        // Push reading to queue (non-blocking)
        if (xQueueSend(readingQueue, &reading, 0) != pdPASS) {
          Serial.println("⚠️ Queue full! Dropping reading...");
        } else {
          Serial.printf("📥 Reading queued at %s\n", getTimestamp().c_str());
        }
      }
    } else {
      // Serial.println("⚠️ Room not created, skipping sensor reading");
    }

    vTaskDelay(100 / portTICK_PERIOD_MS); // Yield to other tasks
  }
}

// ==================== TASK: Upload & WiFi (Consumer) ====================
void taskUpload(void *pvParameters) {
  static int retryCount = 0;
  static unsigned long lastAttempt = 0;

  while (true) {
    // Keep Firebase auth/session alive
    app.loop();

    // ✅ If authenticated and room exists → normal uploads
    if (app.ready() && roomCreated) {
      // Example: dequeue a reading and upload
      DeviceReading reading;
      if (xQueueReceive(readingQueue, &reading, pdMS_TO_TICKS(100)) == pdPASS) {
        uploadReading(reading);
        // Serial.printf("📤 Reading uploaded at %s\n", getTimestamp().c_str());
      }
    }

    // 🛠 If authenticated but room not yet created → retry with backoff
    else if (app.ready() && !roomCreated) {
      unsigned long now = millis();
      unsigned long backoff = min(30000UL, 1000UL * (1 << retryCount));
      // 1s → 2s → 4s → 8s → … → max 30s

      if (now - lastAttempt >= backoff) {
        Serial.printf("🔄 Trying to create room (attempt %d)...\n",
                      retryCount + 1);
        uploadRoom();

        if (roomCreated) {
          retryCount = 0; // reset after success
        } else {
          retryCount = min(retryCount + 1, 5); // cap backoff at 30s
        }

        lastAttempt = now;
      }
    }

    // ⚠️ If not authenticated yet → wait quietly
    else if (!app.ready()) {
      static unsigned long lastWarn = 0;
      if (millis() - lastWarn > 5000) {
        Serial.println("⚠️ Firebase not ready, waiting for auth...");
        lastWarn = millis();
      }
    }

    // Run every 100ms
    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}

// ==================== SETUP ====================
void setup() {
  Serial.begin(115200);

  loadConfigs();
  connectToWiFi();
  configTime(0, 0, "pool.ntp.org");
  initFirebase();

  Serial.printf("Device: %s | Room: %s\n", devConfig.deviceId.c_str(),
                devConfig.roomNumber.c_str());

  // ---------------- CREATE QUEUE ----------------
  readingQueue = xQueueCreate(QUEUE_LENGTH, QUEUE_ITEM_SIZE);
  if (!readingQueue) {
    Serial.println("❌ Failed to create reading queue!");
    while (1)
      vTaskDelay(1000 / portTICK_PERIOD_MS);
  }

  // ---------------- CREATE TASKS ----------------
  xTaskCreatePinnedToCore(taskReadSensors, "TaskReadSensors", 4096, NULL, 1,
                          &taskReadHandle, 1); // Core 1

  xTaskCreatePinnedToCore(taskUpload, "TaskUpload", 8192, NULL, 1,
                          &taskUploadHandle, 0); // Core 0
}

// ==================== LOOP ====================
void loop() {
  vTaskDelay(1000 / portTICK_PERIOD_MS); // Idle
}
