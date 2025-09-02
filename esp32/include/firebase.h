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

// Results
void processFirestoreResults();

// Upload
void uploadVitalReading(const DeviceReading &reading, const String &patientId);
void uploadPatientRecord(const PatientRecord &patient);
void uploadDeviceStatus(const Device &device);
void uploadAlert(const AlertSummary &alert);
void updateRoomStatus(const String &roomNumber, const RoomStatus &status);

// Builders
Document<Values::Value> createReadingDocument(const DeviceReading &reading,
                                              const String &patientId);
Document<Values::Value> createPatientDocument(const PatientRecord &patient);
Document<Values::Value> createDeviceDocument(const Device &device);
Document<Values::Value> createAlertDocument(const AlertSummary &alert);
Document<Values::Value> createRoomDocument(const RoomStatus &status);
