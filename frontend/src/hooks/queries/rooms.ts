import { supabaseClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const getAllRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await supabaseClient.from("rooms").select("*");

      if (error) throw new Error(error?.message);
      return data;
    },
  });
};

export const getRoomDetails = (roomNumber: string) => {
  return useQuery({
    queryKey: ["rooms", roomNumber],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from("rooms")
        .select("*")
        .like("room_number", roomNumber);

      if (error) throw new Error(error?.message);
      return data;
    },
  });
};
