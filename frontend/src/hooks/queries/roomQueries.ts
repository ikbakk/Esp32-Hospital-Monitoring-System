import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RoomType } from "@/types/room";
import {
  useFirestoreCollection,
  useFirestoreDocument,
} from "../useFirestoreQuery";

const roomConverter: FirestoreDataConverter<RoomType> = {
  toFirestore: (room: RoomType) => room as any,
  fromFirestore: (snap) => snap.data() as RoomType,
};

export const getRoomsList = () => {
  return useFirestoreCollection<RoomType>(
    ["rooms"],
    collection(db, "rooms").withConverter(roomConverter),
  );
};

export const getRoomDetails = (roomId: string) => {
  return useFirestoreDocument<RoomType>(
    ["room", roomId],
    doc(db, "rooms", roomId).withConverter(roomConverter),
  );
};
