import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Patient } from "@/types/PatientCard";
import PatientCardContent from "./patientCardContent";
import PatientInfo from "./patientInfo";
import Link from "next/link";

const getConditionColor = (condition: string) => {
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

const getConditionIcon = (condition: string) => {
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

const PatientCard = ({ patient }: { patient: Patient }) => {
  return (
    <Card className="max-w w-full-sm border border-gray-800">
      <CardHeader
        className={`${getConditionColor(patient.condition)} text-white p-4`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{patient.roomNumber}</h3>
            <p className="text-sm opacity-90">Bed {patient.bedNumber}</p>
          </div>
          <div className="flex items-center gap-1">
            {getConditionIcon(patient.condition)}
            <span className="text-sm font-medium capitalize">
              {patient.condition}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Patient Info */}
        <PatientInfo patient={patient} />

        {/* Vital Signs */}
        <PatientCardContent
          vitals={patient.vitals}
          abnormalities={getAbnormalities(patient.vitals)}
        />
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <Link href={`/patient/${patient.id}/details`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs hover:cursor-pointer"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
