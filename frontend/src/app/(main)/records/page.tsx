import { Plus } from "lucide-react";
import RecordsPage from "@/components/pages/records";
import { Button } from "@/components/ui/button";
import type { PatientRecord } from "@/types/PatientRecord";

const mockPatientRecords: PatientRecord[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 45,
    dateOfBirth: "1979-03-15",
    gender: "Female",
    roomNumber: "ICU-101",
    bedNumber: "A",
    admissionDate: "2024-01-15",
    condition: "normal",
    contactInfo: {
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@email.com",
      emergencyContact: "John Johnson (Husband)",
      emergencyPhone: "+1 (555) 987-6543",
    },
    medicalHistory: [
      {
        condition: "Hypertension",
        diagnosedDate: "2020-05-12",
        status: "chronic",
        notes: "Well controlled with medication",
      },
      {
        condition: "Appendectomy",
        diagnosedDate: "2018-08-20",
        status: "resolved",
        notes: "Laparoscopic procedure, no complications",
      },
    ],
    currentMedications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        prescribedDate: "2024-01-15",
        prescribedBy: "Dr. Smith",
        status: "active",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        prescribedDate: "2024-01-15",
        prescribedBy: "Dr. Smith",
        status: "active",
      },
    ],
    allergies: [
      {
        allergen: "Penicillin",
        severity: "moderate",
        reaction: "Skin rash, itching",
        discoveredDate: "2015-06-10",
      },
    ],
    carePlan:
      "Monitor blood pressure and glucose levels. Continue current medications. Physical therapy twice daily.",
    attendingPhysician: "Dr. Michael Smith",
    assignedNurse: "Nurse Jennifer Davis",
    insurance: "Blue Cross Blue Shield",
    bloodType: "O+",
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 62,
    dateOfBirth: "1962-11-08",
    gender: "Male",
    roomNumber: "ICU-102",
    bedNumber: "B",
    admissionDate: "2024-01-14",
    condition: "warning",
    contactInfo: {
      phone: "+1 (555) 234-5678",
      email: "m.chen@email.com",
      emergencyContact: "Lisa Chen (Wife)",
      emergencyPhone: "+1 (555) 876-5432",
    },
    medicalHistory: [
      {
        condition: "Type 2 Diabetes",
        diagnosedDate: "2018-03-22",
        status: "chronic",
        notes: "Managed with medication and diet",
      },
      {
        condition: "Coronary Artery Disease",
        diagnosedDate: "2022-09-15",
        status: "active",
        notes: "Stent placement in LAD, regular cardiology follow-up",
      },
    ],
    currentMedications: [
      {
        name: "Insulin Glargine",
        dosage: "20 units",
        frequency: "Once daily at bedtime",
        prescribedDate: "2024-01-14",
        prescribedBy: "Dr. Wilson",
        status: "active",
      },
      {
        name: "Atorvastatin",
        dosage: "40mg",
        frequency: "Once daily",
        prescribedDate: "2024-01-14",
        prescribedBy: "Dr. Wilson",
        status: "active",
      },
    ],
    allergies: [
      {
        allergen: "Shellfish",
        severity: "severe",
        reaction: "Anaphylaxis",
        discoveredDate: "2010-07-04",
      },
    ],
    carePlan:
      "Cardiac monitoring, blood glucose checks q6h, diabetic diet, cardiology consultation.",
    attendingPhysician: "Dr. Robert Wilson",
    assignedNurse: "Nurse Maria Rodriguez",
    insurance: "Medicare",
    bloodType: "A+",
  },
];

export default function HistoryPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Patient Records
          </h2>
          <p className="text-muted-foreground">
            Comprehensive patient information and medical history
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      <RecordsPage mockPatientRecords={mockPatientRecords} />
    </div>
  );
}
