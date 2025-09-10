#include <medical_functions.h>

void uploadCompletePatientRecord() {
  Serial.println("📋 Uploading complete patient record...");

  if (!ensureFirebaseReady("Patient Record Upload")) {
    Serial.println("❌ Skipping patient record upload - Firebase not ready");
    return;
  }

  PatientRecord patient = createSamplePatient();
  patient.updatedAt = getCurrentTimestamp();

  Serial.printf("📤 Uploading patient record to: patients/%s\n",
                patient.id.c_str());
  Serial.println("   Patient Details:");
  Serial.printf("   - Name: %s, Age: %d\n", patient.name.c_str(), patient.age);
  Serial.printf("   - Room: %s, Bed: %s\n", patient.roomNumber.c_str(),
                patient.bedNumber.c_str());
  Serial.printf("   - Physician: %s\n", patient.attendingPhysician.c_str());
  Serial.printf("   - Nurse: %s\n", patient.assignedNurse.c_str());

  uploadPatientRecord(patient);
  delay(100);
  processFirestoreResults();
}

void uploadCompleteDeviceStatus() {
  Serial.println("🔧 Uploading device status...");

  if (!ensureFirebaseReady("Device Status Upload")) {
    Serial.println("❌ Skipping device status upload - Firebase not ready");
    return;
  }

  Device device = createSampleDevice();

  Serial.printf("📤 Uploading device status to: devices/%s\n",
                device.id.c_str());
  Serial.println("   Device Details:");
  Serial.printf("   - Status: %s\n",
                deviceStatusToString(device.deviceStatus).c_str());
  Serial.printf("   - Location: Room %s, Bed %s\n",
                device.location.roomNumber.c_str(),
                device.location.bedNumber.c_str());

  // uploadDeviceStatus(device);
  delay(100);
  processFirestoreResults();
}

void uploadInitialData() {
  Serial.println("📤 UPLOADING INITIAL DATA TO FIRESTORE...");
  Serial.println("==========================================");

  // Upload patient record first
  uploadCompletePatientRecord();
  delay(500);

  // Upload device status
  uploadCompleteDeviceStatus();
  delay(500);

  // Upload room status
  uploadCompleteRoomStatus();
  delay(500);

  Serial.println("✅ INITIAL DATA UPLOAD COMPLETED");
  Serial.println("Firestore should now contain:");
  Serial.println("   - patients/{id} - Complete patient profile");
  Serial.println("   - devices/{id} - Device status and location");
  Serial.println("   - rooms/{id} - Room occupancy and stats");
  Serial.println("   - patients/{id}/readings/{id} - Will contain vital signs");
  Serial.println(
      "   - alerts/{id} - Will contain medical alerts when triggered");
}

void uploadCompleteRoomStatus() {
  Serial.println("🏥 Uploading room status...");

  if (!ensureFirebaseReady("Room Status Upload")) {
    Serial.println("❌ Skipping room status upload - Firebase not ready");
    return;
  }

  RoomStatus roomStatus = createRoomStatus();

  Serial.printf("📤 Uploading room status to: rooms/%s\n",
                roomStatus.roomNumber.c_str());
  Serial.println("   Room Details:");
  Serial.printf("   - Patient Count: %d\n", roomStatus.patientCount);
  Serial.printf("   - Device Count: %d\n", roomStatus.deviceCount);
  Serial.printf("   - Active Alerts: %d\n", roomStatus.activeAlerts);

  delay(100);
  processFirestoreResults();
}
