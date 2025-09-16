"use client";

import { useState } from "react";
import PatientCard from "@/components/patientCard";
import type { Patient } from "@/types/PatientCard";

import { getRoomsList } from "@/hooks/queries/roomQueries";

interface HomePageProps {
  mockPatients: Patient[];
}

export default function HomePage({ mockPatients }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const { data: roomsList } = getRoomsList();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} roomId="Room_001" />
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No patients found matching your search.
          </p>
        </div>
      )}
    </>
  );
}
