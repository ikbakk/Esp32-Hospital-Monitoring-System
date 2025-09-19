import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { RecordPageUIState } from "../pages/records";
import { Badge } from "../ui/badge";

interface RecordPatientCardProps {
  viewMode: "list" | "grid";
  sortedPatients: any[];
  updateState: (patch: Partial<RecordPageUIState>) => void;
}

export default function RecordPatientCard({
  sortedPatients,
  updateState,
  viewMode,
}: RecordPatientCardProps) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "grid gap-4"
      }
    >
      {sortedPatients.map((patient) => (
        <Card key={patient.id} className="transition-shadow hover:shadow-md">
          <CardContent className={viewMode === "grid" ? "p-4" : "p-6"}>
            <div
              className={
                viewMode === "grid"
                  ? "space-y-3"
                  : "flex items-center justify-between"
              }
            >
              <div
                className={
                  viewMode === "grid"
                    ? "flex flex-col gap-4"
                    : "flex flex-col gap-2"
                }
              >
                <h3 className="text-lg font-semibold">{patient.name}</h3>
                <div
                  className={`${viewMode === "grid" ? "flex-col gap-1 items-start" : ""} flex items-center gap-2 text-sm text-muted-foreground`}
                >
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
              <div
                className={`${viewMode === "grid" ? "justify-between" : ""} flex items-center gap-3 capitalize`}
              >
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
                    size={viewMode === "grid" ? "sm" : "default"}
                    onClick={() => updateState({ selectedPatient: patient })}
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
  );
}
