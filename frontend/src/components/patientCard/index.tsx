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
import type { PatientInfo as Patient } from "@/types/patient";
import PatientCardContent from "./patientCardContent";
import PatientInfo from "./patientInfo";
import { getPatientReadings } from "@/hooks/queries/patientQueries";
import { getConditionColor } from "./cardUtils";
import PatientCardHeader from "./cardHeader";
import last from "lodash/last";
import SkeletonText from "../ui/skeleton-text";

interface PatientCardProps {
  location: {
    roomId: string;
    bedId: string;
  };
  patient: Patient;
  isLoading: boolean;
}

const PatientCard = ({ patient, location, isLoading }: PatientCardProps) => {
  const { data: readings } = getPatientReadings(patient.id);
  const latestReadings = last(readings);

  return (
    <Card className="max-w w-full-sm border border-gray-800">
      <CardHeader className={`${getConditionColor("normal")} p-4 text-white`}>
        <PatientCardHeader
          isLoading={isLoading}
          roomName={location.roomId}
          bedName={location.roomId}
          patientCondition={"normal"}
        />
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-4">
        {/* Patient Info */}
        <PatientInfo
          isLoading={isLoading}
          name={patient.name}
          age={patient.age}
          admissionDate={patient.admissionDate}
        />

        {/* Vital Signs */}
        <PatientCardContent
          isLoading={!readings}
          latestReading={latestReadings}
          // abnormalities={getAbnormalities("")}
        />
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 pb-4">
        <div className="flex w-full items-center justify-between rounded bg-gray-50 p-2 text-xs text-gray-500">
          <SkeletonText
            loading={!readings}
            className="w-full flex items-center gap-1"
            skeletonClassName="w-[65%] h-8 bg-gray-200"
          >
            <Clock className="h-4 w-4" />
            Last updated: <br />
            {latestReadings
              ? new Date(latestReadings.timestamp).toLocaleString()
              : ""}
          </SkeletonText>
          <SkeletonText
            loading={isLoading}
            skeletonClassName="h-8 w-24 bg-gray-200"
          >
            <Link href={`/patient/${patient.id}/details`}>
              <Button
                variant="link"
                size="sm"
                className="text-xs hover:cursor-pointer"
              >
                View Details
              </Button>
            </Link>
          </SkeletonText>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
