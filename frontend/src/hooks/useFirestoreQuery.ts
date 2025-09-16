import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getDoc,
  getDocs,
  onSnapshot,
  CollectionReference,
  DocumentReference,
  Query as FirestoreQuery,
} from "firebase/firestore";
import { useEffect } from "react";
export type FirestoreRef<T> =
  | DocumentReference<T>
  | CollectionReference<T>
  | FirestoreQuery<T>;

export function useFirestoreQuery<T>(
  key: string[],
  ref: DocumentReference<any>,
): UseQueryResult<T | undefined>;

export function useFirestoreQuery<T>(
  key: string[],
  ref: CollectionReference<any> | FirestoreQuery<any>,
): UseQueryResult<T[]>;

// --- Implementation ---
export function useFirestoreQuery<T>(key: string[], ref: FirestoreRef<T>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      if ("id" in ref && "path" in ref && !(ref as any)._query) {
        // document
        const snap = await getDoc(ref as DocumentReference<T>);
        return snap.exists() ? (snap.data() as T) : null;
      } else {
        // collection or query
        const snap = await getDocs(
          ref as CollectionReference<T> | FirestoreQuery<T>,
        );
        return snap.docs.map((d) => d.data() as T);
      }
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(ref as any, (snap: any) => {
      if (snap.docs) {
        // collection or query
        const data = snap.docs.map((d: any) => d.data() as T);
        queryClient.setQueryData(key, data);
      } else {
        // document
        queryClient.setQueryData(
          key,
          snap.exists() ? (snap.data() as T) : null,
        );
      }
    });

    return unsubscribe;
  }, [ref, key, queryClient]);

  return query;
}
