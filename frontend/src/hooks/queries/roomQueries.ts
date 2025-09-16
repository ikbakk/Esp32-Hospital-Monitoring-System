import { collection, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RoomType } from "@/types/room";
import { useFirestoreQuery } from "../useFirestoreQuery";

export const getRoomsList = () => {
  return useFirestoreQuery<RoomType[]>(["rooms"], collection(db, "rooms"));
};

export const getRoomDetails = (roomId: string) => {
  return useFirestoreQuery<RoomType>(
    ["room", roomId],
    doc(db, "rooms", roomId),
  );
};
