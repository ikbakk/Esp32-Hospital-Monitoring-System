import { collection, doc } from "firebase/firestore";
import { useFirestoreQuery } from "../useFirestoreQuery";
import { db } from "@/lib/firebase";

export function getPatientsList() {
  return useFirestoreQuery(["patients"], collection(db, "patients"));
}

export function getPatient(patientId: string) {
  return useFirestoreQuery(
    ["patient", patientId],
    doc(db, "patients", patientId),
  );
}
