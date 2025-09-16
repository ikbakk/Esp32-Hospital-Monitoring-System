import { collection, doc, FirestoreDataConverter } from "firebase/firestore";
import {
  useFirestoreCollection,
  useFirestoreDocument,
} from "../useFirestoreQuery";
import { db } from "@/lib/firebase";
import { type PatientInfo } from "@/types/patient";

const patientConverter: FirestoreDataConverter<PatientInfo> = {
  toFirestore: (patient: PatientInfo) => patient as any,
  fromFirestore: (snap) => snap.data() as PatientInfo,
};

export function getPatientsList() {
  return useFirestoreCollection<PatientInfo>(
    ["patients"],
    collection(db, "patients").withConverter(patientConverter),
  );
}

export function getPatient(roomId: string, patientId: string) {
  return useFirestoreDocument<PatientInfo>(
    ["patient", patientId],
    doc(db, "rooms", roomId, "patients", patientId).withConverter(
      patientConverter,
    ),
  );
}
