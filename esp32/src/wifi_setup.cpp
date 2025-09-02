#include "wifi_setup.h"
#include "config.h"

void connectToWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED && millis() < 30000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi connected: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n❌ WiFi connection failed!");
    return;
  }

  Serial.println();
  Serial.print("✅ Connected with IP: ");
  Serial.println(WiFi.localIP());
}

void checKWiFiConnection() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ WiFi disconnected, attempting reconnection...");
    WiFi.reconnect();
    delay(5000);
    return;
  }
}
