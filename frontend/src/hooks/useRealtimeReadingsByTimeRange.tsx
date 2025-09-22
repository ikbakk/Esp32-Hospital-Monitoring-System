import { supabaseClient } from "@/lib/supabase/client";
import { ReadingsTable } from "@/types/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export type TimeRange = "6h" | "12h" | "24h" | "48h";

interface HooksProps {
  enabled?: boolean;
  patientId: string;
  timeRange: TimeRange;
}

const getCutoffTimestamp = (range: TimeRange): string => {
  const now = new Date().getTime();
  const hours =
    range === "6h" ? 6 : range === "12h" ? 12 : range === "24h" ? 24 : 48;
  const cutoff = new Date(now - hours * 60 * 60 * 1000);
  return cutoff.toISOString();
};

export const useReadingsRealtime = ({
  enabled = true,
  patientId,
  timeRange,
}: HooksProps) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Include patientId in query key for proper cache isolation
  const queryKey = ["readings", timeRange, patientId];

  // Query to fetch readings within the time range
  const query = useQuery<ReadingsTable[]>({
    queryKey,
    queryFn: async () => {
      const cutoff = getCutoffTimestamp(timeRange);
      const { data, error } = await supabaseClient
        .from("readings")
        .select("*")
        .eq("patient_id", patientId)
        .gte("timestamp", cutoff)
        .order("timestamp", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: enabled && !!patientId,
  });

  // Set up real-time subscription for INSERT events only
  useEffect(() => {
    if (!enabled || !supabaseClient || !patientId) return;

    const channelName = `readings-inserts-${patientId}-${timeRange}-${Date.now()}`;
    const channel = supabaseClient.channel(channelName);

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "readings",
        filter: `patient_id=eq.${patientId}`,
      },
      (payload) => {
        const newRecord = payload.new as ReadingsTable;

        // Check if the new record falls within our time range
        const cutoff = getCutoffTimestamp(timeRange);
        const recordTimestamp = newRecord.timestamp;

        if (recordTimestamp! >= cutoff) {
          // Add the new record to the cache (append since order is ascending)
          queryClient.setQueryData(
            queryKey,
            (oldData: ReadingsTable[] | undefined) => {
              if (!oldData) return [newRecord];
              return [...oldData, newRecord]; // Append to end since ordered ascending
            },
          );
        }
      },
    );

    channel.subscribe();
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabaseClient.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [supabaseClient, patientId, timeRange, enabled, queryClient, queryKey]);

  return query;
};
