"use client";

import { Activity, Heart, Thermometer } from "lucide-react";
import VitalTrendCard from "../patientVitalTrendCard";
import { ReadingsTable } from "@/types/supabase";

interface PatientVitalTrendsProps {
  currentPatientData: ReadingsTable[];
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
        dataKey="heart_rate"
        color="var(--color-red-500)"
        unit="bpm"
        normalRange="60-100 bpm"
        paddingPercent={0.2}
      />
      <VitalTrendCard
        title="Oxygen Saturation"
        icon={<Activity className="h-4 w-4 text-blue-500" />}
        data={currentPatientData}
        dataKey="spo2"
        color="var(--color-blue-500)"
        unit="%"
        normalRange="95-100%"
        paddingPercent={0.02}
      />
      <VitalTrendCard
        title="Body Temperature"
        icon={<Thermometer className="h-4 w-4 text-orange-500" />}
        data={currentPatientData}
        dataKey="body_temp"
        color="var(--color-orange-500)"
        unit="°C"
        normalRange="36.0-37.5°C"
        paddingPercent={0.01}
      />
    </div>
  );
};

export default PatientVitalTrends;
