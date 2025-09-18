import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BedType } from "@/types/room";
import {
  useFirestoreCollection,
  useFirestoreDocument,
  useStaticFirestoreDocument,
} from "../useFirestoreQuery";

const roomConverter: FirestoreDataConverter<BedType> = {
  toFirestore: (room: BedType) => room as any,
  fromFirestore: (snap) => snap.data() as BedType,
};

export const getRoomsList = () => {
  return useFirestoreCollection<BedType>(
    ["rooms"],
    collection(db, "rooms").withConverter(roomConverter),
  );
};

export const getBedDetails = (roomId: string, bedId: string) => {
  return useStaticFirestoreDocument<BedType>(
    ["room", roomId, bedId],
    doc(db, "rooms", roomId, "beds", bedId).withConverter(roomConverter),
  );
};
