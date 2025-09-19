#include <globals.h>

bool wifiConnected = false;

void setupWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED && millis() < 30000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi connected: " + WiFi.localIP().toString());
    wifiConnected = true;
  } else {
    Serial.println("\n❌ WiFi connection failed!");
    return;
  }
}
