import { Activity, Heart, Thermometer } from "lucide-react";
import type { Patient } from "@/types/PatientCard";
import type { getAbnormalities } from ".";

interface PatientCardcontentProps {
  vitals: Patient["vitals"];
  abnormalities: ReturnType<typeof getAbnormalities>;
}

const PatientCardContent = ({
  vitals,
  abnormalities,
}: PatientCardcontentProps) => {
  return (
    <div className="space-y-2">
      <VitalSignCard
        icon={<Heart className="w-4 h-4" />}
        label="Heart Rate"
        value={vitals.heartRate}
        unit="bpm"
        isAbnormal={abnormalities.heartRate}
      />

      <VitalSignCard
        icon={<Activity className="w-4 h-4" />}
        label="Oxygen Sat"
        value={vitals.oxygenSaturation}
        unit="%"
        isAbnormal={abnormalities.oxygenSaturation}
      />

      <VitalSignCard
        icon={<Thermometer className="w-4 h-4" />}
        label="Temperature"
        value={vitals.temperature.toFixed(1)}
        unit="°C"
        isAbnormal={abnormalities.temperature}
      />

      <VitalSignCard
        icon={<Activity className="w-4 h-4" />}
        label="Blood Pressure"
        value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
        unit="mmHg"
        isAbnormal={abnormalities.bloodPressure}
      />

      <VitalSignCard
        icon={<Activity className="w-4 h-4" />}
        label="Respiratory"
        value={vitals.respiratoryRate}
        unit="rpm"
        isAbnormal={abnormalities.respiratoryRate}
      />
    </div>
  );
};

const VitalSignCard = ({
  icon,
  label,
  value,
  unit,
  isAbnormal = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  isAbnormal?: boolean;
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div
        className={`p-2.5 rounded-full ${isAbnormal ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-701">{label}</span>
    </div>
    <div className="text-right">
      <div
        className={`text-lg font-bold ${isAbnormal ? "text-red-600" : "text-gray-900"}`}
      >
        {value}
      </div>
      <div className="text-xs text-gray-501 -mt-1">{unit}</div>
    </div>
  </div>
);

export default PatientCardContent;
