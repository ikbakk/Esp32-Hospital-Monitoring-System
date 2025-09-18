"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
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
import { getBedDetails } from "@/hooks/queries/roomQueries";
import { getPatient, getPatientReadings } from "@/hooks/queries/patientQueries";
import { getAbnormalities, getConditionColor } from "./cardUtils";
import PatientCardHeader from "./cardHeader";
import last from "lodash/last";
import { PatientReadings } from "@/types/patient";

interface PatientCardProps {
  location: {
    roomId: string;
    bedId: string;
  };
  patient: Patient & {
    id: string;
    name: string;
  };
}

const PatientCard = ({ patient, location }: PatientCardProps) => {
  const { data: bedData, isLoading: bedDataLoading } = getBedDetails(
    location.roomId,
    location.bedId,
  );
  const { data: patientInfo, isLoading: patientInfoLoading } =
    getPatient("patient_001");
  const { data: readings } = getPatientReadings("patient_001");
  const latestReadings = last(readings);

  return (
    <Card className="max-w w-full-sm border border-gray-800">
      <CardHeader
        className={`${getConditionColor(patient.condition)} text-white p-4`}
      >
        <PatientCardHeader
          isLoading={bedDataLoading}
          roomName={bedData ? bedData.roomNumber : ""}
          bedName={bedData ? bedData.bedNumber : ""}
          patientCondition={patient.condition}
        />
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-4">
        {/* Patient Info */}
        <PatientInfo
          isLoading={patientInfoLoading}
          name={patientInfo ? patientInfo.name : ""}
          age={patientInfo ? patientInfo.age : 0}
          admissionDate={patientInfo ? patientInfo.admissionDate : ""}
        />

        {/* Vital Signs */}
        <PatientCardContent
          isLoading={!readings}
          latestReading={latestReadings}
          abnormalities={getAbnormalities(patient.vitals)}
        />
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 pb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {/* <span>Last updated: {new Date().toLocaleTimeString()}</span> */}
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
