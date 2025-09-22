import { useGetFromTableByColumn } from "../useSupabaseQuery";

export const getReadings = (patientId: string) => {
  return useGetFromTableByColumn("readings", "patient_id", patientId);
};
