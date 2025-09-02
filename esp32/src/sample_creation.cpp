#include <medical_functions.h>

Device createSampleDevice() {
  Device device;
  device.id = deviceId;
  device.deviceStatus = DeviceStatus::ACTIVE;
  device.location.roomNumber = roomNumber;
  device.location.bedNumber = bedNumber;
  return device;
}

PatientRecord createSamplePatient() {
  PatientRecord patient;

  patient.id = patientId;
  patient.name = "John Doe";
  patient.age = 45;
  patient.dateOfBirth = "1979-03-15";
  patient.gender = "Male";
  patient.roomNumber = roomNumber;
  patient.bedNumber = bedNumber;
  patient.admissionDate = "2025-08-30T08:00:00Z";
  patient.condition = PatientCondition::NORMAL;

  // Contact info
  patient.contactInfo.phone = "+1234567890";
  patient.contactInfo.email = "john.doe@email.com";
  patient.contactInfo.emergencyContact = "Jane Doe";
  patient.contactInfo.emergencyPhone = "+1234567891";

  // Medical info
  patient.carePlan = "Standard cardiac monitoring";
  patient.attendingPhysician = "Dr. Smith";
  patient.assignedNurse = "Nurse Johnson";
  patient.insurance = "Health Plus";
  patient.bloodType = "O+";
  patient.monitoringStatus = MonitoringStatus::ACTIVE;

  // Assigned devices
  patient.assignedDevices.push_back(deviceId);

  // Timestamps
  String now = getCurrentTimestamp();
  if (patient.createdAt.isEmpty())
    patient.createdAt = now;
  patient.updatedAt = now;

  return patient;
}

RoomStatus createRoomStatus() {
  RoomStatus roomStatus;
  roomStatus.roomNumber = roomNumber;
  roomStatus.patientCount = 1;
  roomStatus.deviceCount = 1;
  roomStatus.activeAlerts = 0;  // Will be updated based on recent readings
  roomStatus.totalReadings = 0; // Will be incremented
  return roomStatus;
}
