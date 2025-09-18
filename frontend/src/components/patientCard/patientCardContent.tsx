import { Activity, Heart, Thermometer } from "lucide-react";
import type { getAbnormalities } from "./cardUtils";
import { PatientReadings } from "@/types/patient";
import SkeletonText from "../ui/skeleton-text";

interface PatientCardcontentProps {
  latestReading: PatientReadings | undefined;
  isLoading: boolean;
}

const PatientCardContent = ({
  latestReading,
  isLoading,
}: PatientCardcontentProps) => {
  return (
    <div className="space-y-2">
      <VitalSignCard
        icon={<Heart className="h-4 w-4" />}
        label="Heart Rate"
        isLoading={isLoading}
        value={latestReading ? latestReading.heartRate : ""}
        unit="bpm"
      />

      <VitalSignCard
        icon={<Activity className="h-4 w-4" />}
        label="Oxygen Sat"
        isLoading={isLoading}
        value={latestReading ? latestReading.spo2 : ""}
        unit="%"
      />

      <VitalSignCard
        icon={<Thermometer className="h-4 w-4" />}
        label="Temperature"
        isLoading={isLoading}
        value={latestReading ? latestReading.bodyTemp : ""}
        unit="°C"
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
  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
    <div className="flex items-center gap-3">
      <SkeletonText
        loading={isLoading}
        skeletonClassName="size-9 rounded-full bg-gray-200"
      >
        <div
          className={`${isAbnormal ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"} rounded-full p-2.5`}
        >
          {icon}
        </div>
      </SkeletonText>
      <SkeletonText
        loading={isLoading}
        className="text-sm font-medium text-gray-700"
        skeletonClassName="w-20 h-8 bg-gray-200"
      >
        {label}
      </SkeletonText>
    </div>
    <div className="text-right">
      <h4
        className={`${isAbnormal ? "text-red-600" : "text-gray-900"} text-lg font-bold`}
      >
        <SkeletonText
          loading={isLoading}
          skeletonClassName="w-12 h-10 bg-gray-200"
        >
          {value}
          <p className="text-gray-501 -mt-1 text-xs font-normal">{unit}</p>
        </SkeletonText>
      </h4>
    </div>
  </div>
);

export default PatientCardContent;
