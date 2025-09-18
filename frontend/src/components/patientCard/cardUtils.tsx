import { Patient } from "@/types/PatientCard";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export const getConditionColor = (condition: string) => {
  switch (condition) {
    case "normal":
      return "bg-emerald-500";
    case "warning":
      return "bg-amber-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getConditionIcon = (condition: string) => {
  switch (condition) {
    case "normal":
      return <CheckCircle className="w-4 h-4" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4" />;
    case "critical":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

export const getAbnormalities = (vitals: Patient["vitals"]) => {
  return {
    heartRate: vitals.heartRate < 60 || vitals.heartRate > 100,
    oxygenSaturation: vitals.oxygenSaturation < 95,
    temperature: vitals.temperature < 36 || vitals.temperature > 37.5,
    bloodPressure:
      vitals.bloodPressure.systolic > 140 ||
      vitals.bloodPressure.diastolic > 90,
    respiratoryRate: vitals.respiratoryRate < 12 || vitals.respiratoryRate > 20,
  };
};
