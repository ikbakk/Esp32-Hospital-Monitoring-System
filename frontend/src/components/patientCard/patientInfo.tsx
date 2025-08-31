import { User } from "lucide-react";
import type { Patient } from "@/types/PatientCard";

const PatientInfo = ({ patient }: { patient: Patient }) => {
  return (
    <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
      <div className="p-2 bg-gray-100 rounded-full">
        <User className="w-4 h-4 text-gray-600" />
      </div>
      <div>
        <p className="font-semibold text-gray-900">{patient.name}</p>
        <p className="text-sm text-gray-500">
          Age {patient.age} • Admitted{" "}
          {new Date(patient.admissionDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PatientInfo;
