#include <config.h>
#include <firebase.h>
#include <utils.h>

// ==================== GLOBALS ====================
FirebaseApp app;
UserAuth user_auth(API_KEY, USER_EMAIL, USER_PASSWORD, AUTH_EXPIRE_PERIOD);
WiFiClientSecure ssl_client;
AsyncClientClass aClient(ssl_client);
AsyncResult firestoreResult;
Firestore::Documents Docs;
Firestore::Parent parent = Firestore::Parent(FIREBASE_PROJECT_ID);

const String roomNumber = ROOM_NUMBER;
const String patientId = PATIENT_ID;
const String collectionPath =
    "rooms/" + roomNumber + "/patients/" + patientId + "/readings/";

// ==================== INITIALIZATION ====================
void initFirebase() {
  Serial.println("🔄 Initializing Firebase...");

  // Configure SSL
  ssl_client.setInsecure();

  // Initialize Firebase app
  initializeApp(aClient, app, getAuth(user_auth));
  app.getApp<Firestore::Documents>(Docs);
  app.autoAuthenticate(true);

  Serial.println("✅ Firebase initialized");
}

bool ensureFirebaseReady() {
  int retryCount = 0;
  const int maxRetries = 5;

  while (retryCount < maxRetries && !app.ready()) {
    Serial.printf("⏳ Waiting for Firebase... (%d/%d)\n", retryCount + 1,
                  maxRetries);
    delay(1000);
    retryCount++;
  }

  if (app.ready()) {
    Serial.println("✅ Firebase is ready");
    return true;
  }

  Serial.println("❌ Firebase failed to become ready");
  return false;
}

// ==================== RESULT PROCESSING ====================
void processFirestoreResults() {
  if (firestoreResult.isResult()) {
    if (firestoreResult.isError()) {
      Serial.printf("❌ Firestore Error: %s\n",
                    firestoreResult.error().message().c_str());
    } else if (firestoreResult.available()) {
      if (DEBUG_FIREBASE) {
        Serial.println("✅ Firestore operation completed");
      }
    }
    firestoreResult.clear(); // IMPORTANT: Clear the result
  }
}

// ==================== DOCUMENT HELPERS ====================
void addField(Document<Values::Value> &doc, const String &key,
              const String &value) {
  doc.add(key, Values::Value(Values::StringValue(value)));
}

void addField(Document<Values::Value> &doc, const String &key, int value) {
  doc.add(key, Values::Value(Values::IntegerValue(value)));
}

void addField(Document<Values::Value> &doc, const String &key, double value) {
  doc.add(key, Values::Value(Values::DoubleValue(value)));
}

Document<Values::Value> createReadingDocument(const DeviceReading &reading) {
  Document<Values::Value> doc;

  addField(doc, "heartRate", reading.vitalSigns.heartRate);
  addField(doc, "spo2", reading.vitalSigns.spo2);
  addField(doc, "bodyTemp", reading.vitalSigns.bodyTemp);

  if (DEBUG_VITALS) {
    Serial.printf("📊 HR: %.1f | SpO2: %.1f%% | Temp: %.1f°C\n",
                  reading.vitalSigns.heartRate, reading.vitalSigns.spo2,
                  reading.vitalSigns.bodyTemp);
  }

  return doc;
}

// ==================== UPLOAD FUNCTION ====================
void uploadReading(const DeviceReading &reading) {
  if (!app.ready()) {
    Serial.println("⚠️ Firebase not ready, skipping upload");
    return;
  }

  String path = collectionPath + getTimestamp();
  Document<Values::Value> doc = createReadingDocument(reading);

  Docs.createDocument(aClient, parent, path, DocumentMask(), doc,
                      firestoreResult);

  if (DEBUG_FIREBASE) {
    Serial.printf("📤 Uploaded: %s\n", path.c_str());
  }
}
