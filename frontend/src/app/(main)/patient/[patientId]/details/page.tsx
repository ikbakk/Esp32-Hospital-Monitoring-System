"use client";

import PatientCriticalAlerts from "@/components/patientCriticalAlerts";
import PatientVitalTrends from "@/components/patientVitalTrends";
import TimeRangeSelector from "@/components/timeRangeSelector";
import { getPatientReadings } from "@/hooks/queries/patientQueries";
import { usePathname } from "next/navigation";

export default function GraphsPage() {
  const pathname = usePathname();
  const patientId = pathname.split("/")[2];

  const { data: currentPatientData } = getPatientReadings(patientId);
  return (
    <div className="p-6">
      <div className="flex mb-4 w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Patient Vital Signs Analytics
          </h2>
          <p className="text-muted-foreground">
            Real-time monitoring and historical trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          Timeframe:
          <TimeRangeSelector />
        </div>
      </div>
      {currentPatientData ? (
        <PatientVitalTrends currentPatientData={currentPatientData} />
      ) : (
        <div>Fetching data</div>
      )}
      <PatientCriticalAlerts />
    </div>
  );
}
