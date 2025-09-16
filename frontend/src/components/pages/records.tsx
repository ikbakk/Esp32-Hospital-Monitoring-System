"use client";

import { Calendar, Clock, MapPin, Search, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { PatientRecord } from "@/types/PatientRecord";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface RecordsPageProps {
  mockPatientRecords: PatientRecord[];
}

const RecordsPage = ({ mockPatientRecords }: RecordsPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(
    null,
  );

  const filteredPatients = mockPatientRecords.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search patients or rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{patient.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Age {patient.age}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {patient.roomNumber} - Bed {patient.bedNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Admitted{" "}
                        {new Date(patient.admissionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 capitalize">
                  <Badge
                    className={
                      patient.condition === "critical"
                        ? "bg-red-100 text-red-800"
                        : patient.condition === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {patient.condition}
                  </Badge>
                  <Link href={`/records/${patient.id}`}>
                    <Button
                      className="hover:cursor-pointer"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      View Record
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecordsPage;
