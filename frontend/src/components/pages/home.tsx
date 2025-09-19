"use client";

import PatientCard from "@/components/patientCard";
import { getPatientsList } from "@/hooks/queries/patientQueries";

export default function HomePage() {
  const { data: patients, isLoading } = getPatientsList();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {patients
          ? patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isLoading={isLoading}
                location={{ roomId: "room_101", bedId: "bed_a" }}
              />
            ))
          : null}
      </div>
    </>
  );
}
