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
import { getBedDetails } from "@/hooks/queries/roomQueries";
import { getPatient, getPatientReadings } from "@/hooks/queries/patientQueries";
import { getAbnormalities, getConditionColor } from "./cardUtils";
import PatientCardHeader from "./cardHeader";
import last from "lodash/last";
import SkeletonText from "../ui/skeleton-text";

interface PatientCardProps {
  location: {
    roomId: string;
    bedId: string;
  };
  patient: Patient;
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
      <CardHeader className={`${getConditionColor("normal")} p-4 text-white`}>
        <PatientCardHeader
          isLoading={bedDataLoading}
          roomName={bedData ? bedData.roomNumber : ""}
          bedName={bedData ? bedData.bedNumber : ""}
          patientCondition={"normal"}
        />
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-4">
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
          // abnormalities={getAbnormalities("")}
        />
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 pb-4">
        <div className="flex w-full items-center justify-between rounded bg-gray-50 p-2 text-xs text-gray-500">
          <div className="flex w-full items-center gap-1">
            <Clock className="h-4 w-4" />
            <SkeletonText
              loading={!readings}
              className="w-full"
              skeletonClassName="w-3/4 h-7 bg-gray-200"
            >
              Last updated: <br />
              {latestReadings
                ? new Date(latestReadings.timestamp).toLocaleString()
                : ""}
            </SkeletonText>
          </div>
          <SkeletonText
            loading={patientInfoLoading}
            skeletonClassName="h-7 w-24 bg-gray-200"
          >
            <Link
              href={`/patient/${patientInfo ? patientInfo.id : ""}/details`}
            >
              <Button
                variant="link"
                size="sm"
                className="text-xs -mr-4 hover:cursor-pointer"
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
