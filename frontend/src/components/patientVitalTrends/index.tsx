"use client";

import { Activity, Heart, Thermometer } from "lucide-react";
import VitalTrendCard from "../patientVitalTrendCard";
import { PatientReadings } from "@/types/patient";

interface PatientVitalTrendsProps {
  currentPatientData: PatientReadings[];
}

const PatientVitalTrends = ({
  currentPatientData,
}: PatientVitalTrendsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <VitalTrendCard
        title="Heart Rate"
        icon={<Heart className="h-4 w-4 text-red-500" />}
        data={currentPatientData}
        dataKey="heartRate"
        color="var(--color-destructive)"
        unit="bpm"
        normalRange="60-100 bpm"
      />
      <VitalTrendCard
        title="Oxygen Saturation"
        icon={<Activity className="h-4 w-4 text-blue-500" />}
        data={currentPatientData}
        dataKey="spo2"
        color="var(--chart-2)"
        unit="%"
        normalRange="95-100%"
      />
      <VitalTrendCard
        title="Body Temperature"
        icon={<Thermometer className="h-4 w-4 text-orange-500" />}
        data={currentPatientData}
        dataKey="bodyTemp"
        color="var(--chart-4)"
        unit="°C"
        normalRange="36.0-37.5°C"
      />
    </div>
  );
};

export default PatientVitalTrends;
