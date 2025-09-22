import {
  useGetAllFromTable,
  useGetFromTableByColumn,
} from "../useSupabaseQuery";
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabase/client";

type Condition = NonNullable<"normal" | "warning" | "critical" | null>;
interface FilterProps {
  filterCondition: string;
  filterRoom: string;
  sortBy: string;
}

export const getPatients = () => {
  return useGetAllFromTable("patients");
};

export const getPatient = (patientId: string) => {
  const result = useGetFromTableByColumn("patients", "id", patientId);

  // rename single item to `patient`
  const patient = result.data?.[0] ?? null;

  return { patient, ...result }; // keep other React Query props
};

export const getSearchedPatients = (searchTerm?: string) => {
  return useQuery({
    queryKey: ["patients", "search", searchTerm],
    queryFn: async () => {
      let query = supabaseClient.from("patients").select("*");
      if (searchTerm?.trim()) {
        const search = searchTerm.trim();

        const orFilter = [
          `name.ilike.%${search}%`,
          `room_location.ilike.%${search}%`,
          `attending_physician.ilike.%${search}%`,
          `assigned_nurse.ilike.%${search}%`,
        ].join(",");

        query = query.or(orFilter);
      }
      const { data, error } = await query.order("name", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!searchTerm, // Only run the query if searchTerm is provided
  });
};

export const getFilteredPatients = (filterProps?: FilterProps) => {
  return useQuery({
    queryKey: ["patients", "filter", filterProps],
    queryFn: async () => {
      const query = supabaseClient.from("patients").select("*");
      if (filterProps) {
        if (
          filterProps.filterCondition &&
          filterProps.filterCondition !== "all"
        ) {
          query.eq("condition", filterProps.filterCondition as Condition);
        }
        if (filterProps.filterRoom && filterProps.filterRoom !== "all") {
          query.ilike("room_location", `%${filterProps.filterRoom}%`);
        }
        switch (filterProps.sortBy) {
          case "name":
            query.order("name", { ascending: true });
            break;
          case "room":
            query.order("room_location", { ascending: true });
            break;
          case "admission":
            query.order("admission_date", { ascending: false });
            break;
          default:
            query.order("name", { ascending: true });
        }
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!filterProps, // Only run the query if filterProps are provided
  });
};
