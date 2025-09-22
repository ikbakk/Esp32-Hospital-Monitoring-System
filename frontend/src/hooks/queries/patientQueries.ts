import { collection, doc, FirestoreDataConverter } from "firebase/firestore";
import {
  useFirestoreCollection,
  useFirestoreDocument,
  useOrderedReadings,
  useStaticFirestoreCollection,
  useStaticFirestoreDocument,
} from "../useFirestoreQuery";
import { db } from "@/lib/firebase";
import { PatientReadings, type PatientInfo } from "@/types/patient";

const patientConverter: FirestoreDataConverter<PatientInfo> = {
  toFirestore: (patient: PatientInfo) => patient as any,
  fromFirestore: (snap) => snap.data() as PatientInfo,
};

const readingsConverter: FirestoreDataConverter<PatientReadings> = {
  toFirestore: (readings: PatientReadings) => readings as any,
  fromFirestore: (snap) => snap.data() as PatientReadings,
};

export function getPatientsList() {
  return useStaticFirestoreCollection<PatientInfo>(
    ["patients"],
    collection(db, "patients").withConverter(patientConverter),
  );
}

export function getPatient(patientId: string) {
  return useStaticFirestoreDocument<PatientInfo>(
    ["patient", patientId],
    doc(db, "patients", patientId).withConverter(patientConverter),
  );
}

export function getPatientReadings(patientId: string) {
  return useStaticFirestoreCollection<PatientReadings>(
    [patientId, "readings"],
    collection(db, "patients", patientId, "readings").withConverter(
      readingsConverter,
    ),
  );
}

export function getPatientReading(patientId: string, readingId: string) {
  return useOrderedReadings<PatientReadings>(
    [patientId, "readings", readingId],
    collection(db, "patients", patientId, "readings", readingId).withConverter(
      readingsConverter,
    ),
  );
}
