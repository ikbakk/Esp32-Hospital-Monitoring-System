import { Activity, Heart, Thermometer } from "lucide-react";
import type { getAbnormalities } from "./cardUtils";
import { PatientReadings } from "@/types/patient";
import SkeletonText from "../ui/skeleton-text";

interface PatientCardcontentProps {
  latestReading: PatientReadings | undefined;
  isLoading: boolean;
  abnormalities: ReturnType<typeof getAbnormalities>;
}

const PatientCardContent = ({
  latestReading,
  abnormalities,
  isLoading,
}: PatientCardcontentProps) => {
  return (
    <div className="space-y-2">
      <VitalSignCard
        icon={<Heart className="w-4 h-4" />}
        label="Heart Rate"
        isLoading={isLoading}
        value={latestReading ? latestReading.heartRate : ""}
        unit="bpm"
        isAbnormal={abnormalities.heartRate}
      />

      <VitalSignCard
        icon={<Activity className="w-4 h-4" />}
        label="Oxygen Sat"
        isLoading={isLoading}
        value={latestReading ? latestReading.spo2 : ""}
        unit="%"
        isAbnormal={abnormalities.oxygenSaturation}
      />

      <VitalSignCard
        icon={<Thermometer className="w-4 h-4" />}
        label="Temperature"
        isLoading={isLoading}
        value={latestReading ? latestReading.bodyTemp : ""}
        unit="°C"
        isAbnormal={abnormalities.temperature}
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
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  isAbnormal?: boolean;
  isLoading: boolean;
}) => (
  <div className="flex items-center justify-between py-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div
        className={`p-2.5 rounded-full ${isAbnormal ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-701">{label}</span>
    </div>
    <div className="text-right">
      <h4
        className={`text-lg font-bold ${isAbnormal ? "text-red-600" : "text-gray-900"}`}
      >
        <SkeletonText
          loading={isLoading}
          skeletonClassName="w-11 h-7 bg-gray-200"
        >
          {value}
        </SkeletonText>
      </h4>
      <div className="text-xs text-gray-501 -mt-1">{unit}</div>
    </div>
  </div>
);

export default PatientCardContent;
