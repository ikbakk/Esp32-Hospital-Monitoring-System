"use client";

import PatientCriticalAlerts from "@/components/patientCriticalAlerts";
import PatientVitalTrends from "@/components/patientVitalTrends";
import TimeRangeSelector from "@/components/timeRangeSelector";
import { Skeleton } from "@/components/ui/skeleton";
import SkeletonText from "@/components/ui/skeleton-text";
import { getPatient, getPatientReadings } from "@/hooks/queries/patientQueries";
import { PatientReadings } from "@/types/patient";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function GraphsPage() {
  const [timeRange, setTimeRange] = useState("24h");
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  const { data: patient } = getPatient(patientId);
  const { data: currentPatientData } = getPatientReadings(patientId);

  const filterByTimeRange = (data: PatientReadings[], range: string) => {
    const now = new Date().getTime();
    const hours =
      range === "6h"
        ? 6
        : range === "12h"
          ? 12
          : range === "24h"
            ? 24
            : range === "48h"
              ? 48
              : 24; // default 24h

    const cutoff = now - hours * 60 * 60 * 1000;
    return data.filter((r) => new Date(r.timestamp).getTime() >= cutoff);
  };

  const filteredData = currentPatientData
    ? filterByTimeRange(currentPatientData, timeRange)
    : currentPatientData;

  return (
    <div className="p-6">
      <div className="mb-4 flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <SkeletonText
            loading={!patient}
            skeletonClassName="w-full h-8 bg-gray-200"
          >
            <h2 className="w-full text-2xl font-bold text-foreground">
              {patient?.name}
            </h2>
          </SkeletonText>
          <h4 className="w-full text-muted-foreground">
            <SkeletonText
              loading={!patient}
              skeletonClassName="w-full h-6 bg-gray-200"
            >
              Age {patient?.age} - Admission Date {patient?.admissionDate}
            </SkeletonText>
          </h4>
        </div>
        <div className="flex items-center gap-3">
          Timeframe:
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
      </div>
      {filteredData ? (
        <PatientVitalTrends currentPatientData={filteredData} />
      ) : (
        <div>Fetching data</div>
      )}
      <PatientCriticalAlerts />
    </div>
  );
}
