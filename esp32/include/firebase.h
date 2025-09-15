#pragma once

#define ENABLE_FIRESTORE
#define ENABLE_USER_AUTH

#include <FirebaseClient.h>
#include <WiFiClientSecure.h>
#include <types.h>

// ==== Globals ====
// Firebase core
extern FirebaseApp app;
extern UserAuth user_auth;
extern WiFiClientSecure ssl_client;
extern AsyncClientClass aClient;

// Firestore
extern AsyncResult firestoreResult;
extern Firestore::Documents Docs;

// ==== Functions ====
// Init
void initFirebase();
void forceReAuth();
bool verifyUser(const String &apiKey, const String &email,
                const String &password);
bool ensureFirebaseReady(const String &operation);

// Results
void processFirestoreResults();

// Upload
void uploadPatientReadings(const DeviceReading &reading);
void initialPatientUpload(const PatientRecord &patient);

// Builders
Document<Values::Value> createReadingDocument(const DeviceReading &reading);
Document<Values::Value> createPatientDocument(const PatientRecord &patient);
