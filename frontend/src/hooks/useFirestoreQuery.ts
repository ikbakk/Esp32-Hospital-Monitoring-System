import {
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  onSnapshot,
  CollectionReference,
  DocumentReference,
  Query as FirestoreQuery,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { useEffect } from "react";

export function useFirestoreDocument<T>(
  key: QueryKey,
  ref: DocumentReference<T>,
): UseQueryResult<T | undefined> {
  const queryClient = useQueryClient();

  const query = useQuery<T | undefined>({
    queryKey: key,
    queryFn: () => Promise.resolve(undefined), // unused, just to satisfy TS
    enabled: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.exists() ? (snap.data() as T) : undefined;
      queryClient.setQueryData<T | undefined>(key, data);
    });
    return unsubscribe;
  }, [ref, key, queryClient]);

  return query;
}

export function useStaticFirestoreDocument<T>(
  key: QueryKey,
  ref: DocumentReference<T>,
): UseQueryResult<T | undefined> {
  return useQuery<T | undefined>({
    queryKey: key,
    queryFn: async () => {
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data() as T) : undefined;
    },
    staleTime: 1000 * 60 * 5, // e.g. 5 min cache
  });
}

export function useFirestoreCollection<T>(
  key: QueryKey,
  ref: CollectionReference<T> | FirestoreQuery<T>,
): UseQueryResult<T[]> {
  const queryClient = useQueryClient();

  const query = useQuery<T[]>({
    queryKey: key,
    queryFn: () => Promise.resolve([]), // unused, only for typing
    enabled: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => d.data() as T);
      queryClient.setQueryData<T[]>(key, data);
    });
    return unsubscribe;
  }, [ref, key, queryClient]);

  return query;
}

export function useStaticFirestoreCollection<T>(
  key: QueryKey,
  ref: CollectionReference<T> | FirestoreQuery<T>,
): UseQueryResult<T[]> {
  return useQuery<T[]>({
    queryKey: key,
    queryFn: async () => {
      const snap = await getDocs(ref);
      return snap.docs.map((d) => d.data() as T);
    },
    staleTime: 1000 * 60 * 5, // cache 5 min, adjust as needed
  });
}

export function useOrderedReadings<T>(
  key: QueryKey,
  ref: CollectionReference<T> | FirestoreQuery<T>,
): UseQueryResult<T[]> {
  const queryClient = useQueryClient();

  const q = query(ref, orderBy("timestamp", "desc"));

  const queryResult = useQuery<T[]>({
    queryKey: key,
    queryFn: async () => {
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as T);
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => d.data() as T);
      queryClient.setQueryData<T[]>(key, data);
    });
    return unsubscribe;
  }, [q, key, queryClient]);

  return queryResult;
}
