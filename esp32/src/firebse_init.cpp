#include "firebase.h"
#include <config.h>

FirebaseApp app;
UserAuth user_auth(API_KEY, USER_EMAIL, USER_PASSWORD, AUTH_EXPIRE_PERIOD);
WiFiClientSecure ssl_client;
AsyncClientClass aClient(ssl_client);

AsyncResult firestoreResult;
Firestore::Documents Docs;

void initFirebase() {
  // Configure SSL client
  ssl_client.setInsecure();

  // Verify user
  Serial.println("Verifying the current user... ");
  bool ret = verifyUser(API_KEY, USER_EMAIL, USER_PASSWORD);
  Serial.println(ret ? "✅ User verification successful"
                     : "❌ User verification failed");

  Serial.println("🚀 Initializing app...");

  // Initialize Firebase app with auth callback
  initializeApp(aClient, app, getAuth(user_auth));

  Serial.println("⏳ Waiting for Firebase to be ready...");
  int waitCount = 0;
  while (!app.ready() && waitCount < 30) {
    delay(1000);
    waitCount++;
    Serial.print(".");
  }
  Serial.println();

  if (!app.ready()) {
    Serial.println("❌ Firebase failed to initialize!");
    Serial.println("   Check your credentials and network connection");
  } else {
    Serial.println("✅ Firebase initialized successfully");
  }

  app.getApp<Firestore::Documents>(Docs);

  // Auto authenticate
  app.autoAuthenticate(true);
}

void forceReAuth() {
  if (app.ttl() <= 300 - 60) {
    app.authenticate();
  }
}

bool verifyUser(const String &apiKey, const String &email,
                const String &password) {
  if (ssl_client.connected())
    ssl_client.stop();

  String host = "www.googleapis.com";
  bool ret = false;

  if (ssl_client.connect(host.c_str(), 443) > 0) {
    String payload = "{\"email\":\"";
    payload += email;
    payload += "\",\"password\":\"";
    payload += password;
    payload += "\",\"returnSecureToken\":true}";

    String header = "POST /identitytoolkit/v3/relyingparty/verifyPassword?key=";
    header += apiKey;
    header += " HTTP/1.1\r\n";
    header += "Host: ";
    header += host;
    header += "\r\n";
    header += "Content-Type: application/json\r\n";
    header += "Content-Length: ";
    header += payload.length();
    header += "\r\n\r\n";

    if (ssl_client.print(header) == header.length()) {
      if (ssl_client.print(payload) == payload.length()) {
        unsigned long ms = millis();
        while (ssl_client.connected() && ssl_client.available() == 0 &&
               millis() - ms < 5000) {
          delay(1);
        }

        ms = millis();
        while (ssl_client.connected() && ssl_client.available() &&
               millis() - ms < 5000) {
          String line = ssl_client.readStringUntil('\n');
          if (line.length()) {
            ret = line.indexOf("HTTP/1.1 200 OK") > -1;
            break;
          }
        }
        ssl_client.stop();
      }
    }
  }

  return ret;
}
