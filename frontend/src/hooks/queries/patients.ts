import {
  useGetAllFromTable,
  useGetFromTableByColumn,
} from "../useSupabaseQuery";

export const getPatients = () => {
  return useGetAllFromTable("patients");
};

export const getPatient = (patientId: string) => {
  const result = useGetFromTableByColumn("patients", "id", patientId);

  // rename single item to `patient`
  const patient = result.data?.[0] ?? null;

  return { patient, ...result }; // keep other React Query props
};
