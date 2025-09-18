import SkeletonText from "../ui/skeleton-text";

interface PatientInfoProps {
  isLoading: boolean;
  name: string;
  age: number;
  admissionDate: string;
}

const PatientInfo = ({
  name,
  age,
  admissionDate,
  isLoading,
}: PatientInfoProps) => {
  const date = new Date(admissionDate).toLocaleString();

  return (
    <div className="flex w-full flex-col gap-1 border-b border-gray-800 pb-3">
      <h2 className="font-semibold text-gray-900">
        <SkeletonText
          loading={isLoading}
          skeletonClassName="h-6 w-full rounded-md bg-gray-200"
        >
          {name}
        </SkeletonText>
      </h2>

      <div className="flex w-full  flex-col gap-1">
        <h4 className="w-full text-sm text-gray-500">
          <SkeletonText
            loading={isLoading}
            skeletonClassName="h-5 w-1/4 rounded-md bg-gray-200"
          >
            Age {age}
          </SkeletonText>
        </h4>
        <h4 className="w-full text-sm text-gray-500">
          <SkeletonText
            loading={isLoading}
            skeletonClassName="h-5 w-3/4 rounded-md bg-gray-200"
          >
            Admitted {date}
          </SkeletonText>
        </h4>
      </div>
    </div>
  );
};

export default PatientInfo;
