import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentReference,
  Query as FirestoreQuery,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect } from "react";

type FirestoreRef<T> =
  | DocumentReference<T>
  | CollectionReference<T>
  | FirestoreQuery<T>;

export function useFirestoreQuery<T>(key: string[], ref: FirestoreRef<T>) {
  const queryClient = useQueryClient();

  // 1. Initial fetch
  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      if ("id" in ref && "path" in ref && !(ref as any)._query) {
        console.log("ref1", ref);
        // firestore document
        const snap = await getDoc(ref as DocumentReference<T>);
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
      } else {
        console.log("ref", ref);
        // collection or query
        const snap = await getDocs(
          ref as CollectionReference<T> | FirestoreQuery<T>,
        );
        return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as T[];
      }
    },
    staleTime: Infinity,
  });

  // 2. Subscribe realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(ref as any, (snap: any) => {
      if (snap.docs) {
        // collection or query
        const data = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        queryClient.setQueryData(key, data);
      } else {
        // document
        queryClient.setQueryData(
          key,
          snap.exists() ? { id: snap.id, ...snap.data() } : null,
        );
      }
    });

    return unsubscribe;
  }, [ref, key, queryClient]);

  return query;
}

export function getPatientsList() {
  return useFirestoreQuery(["patients"], collection(db, "patients"));
}

export function getPatient(patientId: string) {
  return useFirestoreQuery(
    ["patient", patientId],
    doc(db, "patients", patientId),
  );
}

export function usePatients(patientId: string) {
  const queryClient = useQueryClient();

  const readingsRef = collection(db, "patients", patientId, "readings");

  // initial fetch
  const query = useQuery({
    queryKey: ["patientReadings", patientId],
    queryFn: async () => {
      const snap = await getDocs(readingsRef);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    staleTime: Infinity,
  });

  // realtime updates
  useEffect(() => {
    if (!patientId) return;

    const unsubscribe = onSnapshot(readingsRef, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      queryClient.setQueryData(["patientReadings", patientId], data);
    });

    return unsubscribe;
  }, [patientId, queryClient]);

  return query;
}

// // Query to get a specific patient
// export const usePatient = (patientId) => {
//   return useQuery({
//     queryKey: ["patient", patientId],
//     queryFn: async () => {
//       const docRef = doc(db, "patients", patientId);
//       const docSnap = await getDoc(docRef);
//
//       if (docSnap.exists()) {
//         return { id: docSnap.id, ...docSnap.data() };
//       } else {
//         throw new Error("Patient not found");
//       }
//     },
//     enabled: !!patientId, // Only run query if patientId exists
//   });
// };
//
// // Query to get all readings for a specific patient
// export const usePatientReadings = (patientId) => {
//   return useQuery({
//     queryKey: ["patient", patientId, "readings"],
//     queryFn: async () => {
//       const readingsRef = collection(db, "patients", patientId, "readings");
//       const q = query(readingsRef, orderBy("timestamp", "desc"));
//       const querySnapshot = await getDocs(q);
//
//       const readings = [];
//       querySnapshot.forEach((doc) => {
//         readings.push({ id: doc.id, ...doc.data() });
//       });
//
//       return readings;
//     },
//     enabled: !!patientId,
//   });
// };
//
// // Query to get a specific reading
// export const usePatientReading = (patientId, readingId) => {
//   return useQuery({
//     queryKey: ["patient", patientId, "reading", readingId],
//     queryFn: async () => {
//       const docRef = doc(db, "patients", patientId, "readings", readingId);
//       const docSnap = await getDoc(docRef);
//
//       if (docSnap.exists()) {
//         return { id: docSnap.id, ...docSnap.data() };
//       } else {
//         throw new Error("Reading not found");
//       }
//     },
//     enabled: !!patientId && !!readingId,
//   });
// };
//
// // Query to get readings within a date range
// export const usePatientReadingsByDateRange = (
//   patientId,
//   startDate,
//   endDate,
// ) => {
//   return useQuery({
//     queryKey: [
//       "patient",
//       patientId,
//       "readings",
//       "dateRange",
//       startDate,
//       endDate,
//     ],
//     queryFn: async () => {
//       const readingsRef = collection(db, "patients", patientId, "readings");
//       const q = query(
//         readingsRef,
//         where("timestamp", ">=", startDate),
//         where("timestamp", "<=", endDate),
//         orderBy("timestamp", "desc"),
//       );
//       const querySnapshot = await getDocs(q);
//
//       const readings = [];
//       querySnapshot.forEach((doc) => {
//         readings.push({ id: doc.id, ...doc.data() });
//       });
//
//       return readings;
//     },
//     enabled: !!patientId && !!startDate && !!endDate,
//   });
// };
//
// // Query to get readings with alerts
// export const usePatientReadingsWithAlerts = (patientId) => {
//   return useQuery({
//     queryKey: ["patient", patientId, "readings", "withAlerts"],
//     queryFn: async () => {
//       const readingsRef = collection(db, "patients", patientId, "readings");
//       const q = query(readingsRef, orderBy("timestamp", "desc"));
//       const querySnapshot = await getDocs(q);
//
//       const readingsWithAlerts = [];
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         const hasAlerts =
//           (data.vitalSigns?.bodyTemp?.alert?.status !== "none" &&
//             (data.vitalSigns?.bodyTemp?.alert?.criticalCount > 0 ||
//               data.vitalSigns?.bodyTemp?.alert?.warningCount > 0)) ||
//           (data.vitalSigns?.heartRate?.alert?.status !== "none" &&
//             (data.vitalSigns?.heartRate?.alert?.criticalCount > 0 ||
//               data.vitalSigns?.heartRate?.alert?.warningCount > 0));
//
//         if (hasAlerts) {
//           readingsWithAlerts.push({ id: doc.id, ...data });
//         }
//       });
//
//       return readingsWithAlerts;
//     },
//     enabled: !!patientId,
//   });
// };
//
// // Hook to get multiple patients' latest readings
// export const useMultiplePatientsLatestReadings = (patientIds) => {
//   return useQueries({
//     queries: patientIds.map((patientId) => ({
//       queryKey: ["patient", patientId, "latestReading"],
//       queryFn: async () => {
//         const readingsRef = collection(db, "patients", patientId, "readings");
//         const q = query(readingsRef, orderBy("timestamp", "desc"), limit(1));
//         const querySnapshot = await getDocs(q);
//
//         if (!querySnapshot.empty) {
//           const doc = querySnapshot.docs[0];
//           return { patientId, reading: { id: doc.id, ...doc.data() } };
//         }
//         return { patientId, reading: null };
//       },
//       enabled: !!patientId,
//     })),
//   });
// };
