#ifndef CONFIG_H
#define CONFIG_H

#include <Adafruit_MLX90614.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <MAX30100_PulseOximeter.h>
#include <SPI.h>
#include <WiFi.h>
#include <Wire.h>
#include <time.h>

//==============================================================================
// WiFi Configuration
//==============================================================================
#ifndef WIFI_SSID
#define WIFI_SSID ""
#endif

#ifndef WIFI_PASSWORD
#define WIFI_PASSWORD ""
#endif

//==============================================================================
// Supabase Configuration
//==============================================================================
#ifndef SUPABASE_URL
#define SUPABASE_URL "https://your-project.supabase.co"
#endif

#ifndef SUPABASE_ANON_KEY
#define SUPABASE_ANON_KEY "your-anon-key"
#endif

// Patient Configuration
#define PATIENT_ID "4d62d0bb-9410-4928-bc1a-492c683852ce"

//==============================================================================
// Hardware Pin Configuration
//==============================================================================
// I2C Configuration
#define SDA_PIN 21
#define SCL_PIN 22
#define I2C_FREQUENCY 400000

// LED Indicators (optional)
#define STATUS_LED_PIN 2
#define ERROR_LED_PIN 4

//==============================================================================
// Sensor Configuration
//==============================================================================
// MAX30100/MAX30105 Configuration
#define MAX30100_INT_PIN -1 // -1 if not using interrupt pin
#define PULSE_AMPLITUDE_RED 0x0A
#define PULSE_AMPLITUDE_IR 0x0A
#define SAMPLE_RATE 100 // Samples per second
#define PULSE_WIDTH 411 // Pulse width in microseconds

// MLX90614 Configuration
#define TEMP_SENSOR_ADDRESS 0x5A // Default I2C address
#define MIN_BODY_TEMP 30.0       // Minimum reasonable body temperature (°C)
#define MAX_BODY_TEMP 45.0       // Maximum reasonable body temperature (°C)

//==============================================================================
// Task Configuration
//==============================================================================
// Task Priorities (higher number = higher priority)
#define SENSOR_TASK_PRIORITY 3
#define NETWORK_TASK_PRIORITY 2
#define WATCHDOG_TASK_PRIORITY 4
#define STATUS_TASK_PRIORITY 1

// Task Stack Sizes (in bytes)
#define SENSOR_TASK_STACK 4096
#define NETWORK_TASK_STACK 8192
#define WATCHDOG_TASK_STACK 2048
#define STATUS_TASK_STACK 2048

// Core Assignment
#define SENSOR_CORE 1  // Dedicated core for sensors
#define NETWORK_CORE 0 // Core for network operations

//==============================================================================
// Timing Configuration
//==============================================================================
#define READING_INTERVAL_MS 5000   // Time between sensor readings
#define UPLOAD_INTERVAL_MS 30000   // Time between uploads
#define HEARTBEAT_INTERVAL_MS 1000 // Time between heartbeat checks
#define WATCHDOG_INTERVAL_MS 30000 // Watchdog check interval
#define WIFI_TIMEOUT_MS 20000      // WiFi connection timeout
#define HTTP_TIMEOUT_MS 10000      // HTTP request timeout

//==============================================================================
// Data Configuration
//==============================================================================
#define MAX_QUEUE_SIZE 50        // Maximum readings in queue
#define MAX_UPLOAD_BATCH 10      // Maximum readings per upload
#define HEART_RATE_BUFFER_SIZE 4 // Size of heart rate averaging buffer

// Heart Rate Validation
#define MIN_HEART_RATE 50  // Minimum valid heart rate (BPM)
#define MAX_HEART_RATE 200 // Maximum valid heart rate (BPM)

// SpO2 Validation
#define MIN_SPO2 70  // Minimum valid SpO2 (%)
#define MAX_SPO2 100 // Maximum valid SpO2 (%)

//==============================================================================
// System Configuration
//==============================================================================
#define SERIAL_BAUD_RATE 115200
#define WATCHDOG_TIMEOUT_SEC 60  // System watchdog timeout
#define MIN_FREE_HEAP 10000      // Minimum free heap warning threshold
#define QUEUE_FULL_THRESHOLD 0.8 // Queue full warning threshold (80%)

//==============================================================================
// Debug Configuration
//==============================================================================
#define DEBUG_SENSORS 1 // Enable sensor debug output
#define DEBUG_NETWORK 1 // Enable network debug output
#define DEBUG_TIMING 0  // Enable timing debug output
#define DEBUG_MEMORY 1  // Enable memory debug output

//==============================================================================
// NTP Configuration
//==============================================================================
#define NTP_SERVER1 "pool.ntp.org"
#define NTP_SERVER2 "time.nist.gov"
#define NTP_SERVER3 "time.cloudflare.com"
#define GMT_OFFSET_SEC 0      // UTC offset in seconds
#define DAYLIGHT_OFFSET_SEC 0 // Daylight saving offset

//==============================================================================
// Error Handling Configuration
//==============================================================================
#define MAX_WIFI_RETRIES 3
#define MAX_HTTP_RETRIES 3
#define MAX_SENSOR_ERRORS 5
#define ERROR_RESTART_THRESHOLD                                                \
  10 // Restart system after this many critical errors

//==============================================================================
// Medical Alert Thresholds (for future use)
//==============================================================================
#define CRITICAL_LOW_HR 50
#define CRITICAL_HIGH_HR 150
#define CRITICAL_LOW_SPO2 90
#define CRITICAL_LOW_TEMP 35.0
#define CRITICAL_HIGH_TEMP 39.0

#endif // CONFIG_H
