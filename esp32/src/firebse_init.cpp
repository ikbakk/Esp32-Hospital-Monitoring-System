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
  Serial.println("⏳ Verifying the current user... ");
  bool ret = verifyUser(API_KEY, USER_EMAIL, USER_PASSWORD);
  Serial.println(ret ? "✅ User verification successful"
                     : "❌ User verification failed");

  // Initialize Firebase app with auth callback
  initializeApp(aClient, app, getAuth(user_auth));

  Serial.println("⏳ Waiting for Firebase to be ready...");

  app.getApp<Firestore::Documents>(Docs);

  // Auto authenticate
  app.autoAuthenticate(true);
}

bool ensureFirebaseReady(const String &operation) {
  int retryCount = 0;
  const int maxRetries = 3;

  while (retryCount < maxRetries) {
    if (app.ready()) {
      return true;
    }

    Serial.printf("⚠️ Firebase not ready for %s (attempt %d/%d)\n",
                  operation.c_str(), retryCount + 1, maxRetries);
    delay(1000);
    retryCount++;
  }

  Serial.printf("❌ Firebase failed to become ready for %s\n",
                operation.c_str());
  return false;
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
