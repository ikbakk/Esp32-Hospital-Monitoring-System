import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  onSnapshot,
  CollectionReference,
  DocumentReference,
  Query as FirestoreQuery,
} from "firebase/firestore";
import { useEffect } from "react";

export function useFirestoreDocument<T>(
  key: string[],
  ref: DocumentReference<T>,
): UseQueryResult<T | null> {
  const queryClient = useQueryClient();

  const query = useQuery<T | null>({
    queryKey: key,
    queryFn: async () => null,
    enabled: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.exists() ? (snap.data() as T) : null;
      queryClient.setQueryData<T | null>(key, (old: T | null | undefined) =>
        JSON.stringify(old) !== JSON.stringify(data) ? data : (old ?? null),
      );
    });
    return unsubscribe;
  }, [ref, key, queryClient]);

  return query;
}

export function useFirestoreCollection<T>(
  key: string[],
  ref: CollectionReference<T> | FirestoreQuery<T>,
): UseQueryResult<T[]> {
  const queryClient = useQueryClient();

  const query = useQuery<T[]>({
    queryKey: key,
    queryFn: async () => [],
    enabled: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => d.data() as T);
      queryClient.setQueryData<T[]>(key, (old: T[] | undefined) =>
        JSON.stringify(old) !== JSON.stringify(data) ? data : (old ?? []),
      );
    });
    return unsubscribe;
  }, [ref, key, queryClient]);

  return query;
}
