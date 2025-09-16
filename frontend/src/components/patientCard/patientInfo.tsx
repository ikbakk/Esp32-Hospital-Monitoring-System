import { Timestamp } from "firebase/firestore";
import SkeletonText from "../ui/skeleton-text";

interface PatientInfoProps {
  name: string | undefined;
  age: number | undefined;
  admissionDate: Timestamp | undefined;
}

const PatientInfo = ({ name, age, admissionDate }: PatientInfoProps) => {
  return (
    <div className="flex w-full flex-col gap-1 border-b border-gray-800 pb-3">
      <h2 className="font-semibold text-gray-900">
        <SkeletonText
          loading={!name}
          skeletonClassName="h-6 w-full rounded-md bg-gray-200"
        >
          {name}
        </SkeletonText>
      </h2>

      <div className="flex w-full  flex-col gap-1">
        <h4 className="w-full text-sm text-gray-500">
          <SkeletonText
            loading={!age}
            skeletonClassName="h-5 w-1/4 rounded-md bg-gray-200"
          >
            Age {age}
          </SkeletonText>
        </h4>
        <h4 className="w-full text-sm text-gray-500">
          <SkeletonText
            loading={!admissionDate}
            skeletonClassName="h-5 w-3/4 rounded-md bg-gray-200"
          >
            Admitted {admissionDate?.toDate().toDateString()}
          </SkeletonText>
        </h4>
      </div>
    </div>
  );
};

export default PatientInfo;
