import SkeletonText from "../ui/skeleton-text";
import { getConditionIcon } from "./cardUtils";

interface PatientCardProps {
  isLoading: boolean;
  roomName: string;
  bedName: string;
  patientCondition: string;
}

export default function PatientCardHeader({
  isLoading,
  roomName,
  bedName,
  patientCondition,
}: PatientCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg">
          <SkeletonText
            loading={isLoading}
            skeletonClassName="h-8 w-24 rounded-md"
          >
            {roomName}
          </SkeletonText>
        </h3>

        <h4 className="text-sm opacity-90">
          <SkeletonText
            loading={isLoading}
            skeletonClassName="h-4 w-20 rounded-md"
          >
            {bedName}
          </SkeletonText>
        </h4>
      </div>
      <div className="flex items-center gap-1">
        {getConditionIcon(patientCondition)}
        <span className="text-sm font-medium capitalize">
          {patientCondition}
        </span>
      </div>
    </div>
  );
}
