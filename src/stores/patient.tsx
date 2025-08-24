import { create } from "zustand";

export const patientStore = create((set) => ({
  patientTotal: 0,
}));
