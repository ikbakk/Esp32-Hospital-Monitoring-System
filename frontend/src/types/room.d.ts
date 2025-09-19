export interface RoomType {
  id: string;
  bedNumber: string;
  roomNumber: string;
}

export interface BedType {
  id: string;
  name: string;
  bedNumber: string;
  roomNumber: string;
}

export interface Room {
  id: string;
  number: string;
  status: "occupied" | "available" | "maintenance" | "disabled";
  patientId?: string;
  patientName?: string;
  bedType: "ICU" | "General" | "Emergency";
  lastCleaned?: string;
}
