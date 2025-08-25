import HomePage from "@/components/pages/home";
import type { Patient } from "@/types/PatientCard";

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 45,
    roomNumber: "ICU-101",
    bedNumber: "A",
    admissionDate: "2024-01-15",
    condition: "normal",
    vitals: {
      heartRate: 72,
      oxygenSaturation: 98,
      temperature: 36.8,
      bloodPressure: { systolic: 120, diastolic: 80 },
      respiratoryRate: 16,
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 62,
    roomNumber: "ICU-102",
    bedNumber: "B",
    admissionDate: "2024-01-14",
    condition: "warning",
    vitals: {
      heartRate: 95,
      oxygenSaturation: 94,
      temperature: 37.8,
      bloodPressure: { systolic: 140, diastolic: 90 },
      respiratoryRate: 22,
    },
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    age: 28,
    roomNumber: "ICU-103",
    bedNumber: "A",
    admissionDate: "2024-01-16",
    condition: "critical",
    vitals: {
      heartRate: 110,
      oxygenSaturation: 89,
      temperature: 39.2,
      bloodPressure: { systolic: 160, diastolic: 100 },
      respiratoryRate: 28,
    },
  },
  {
    id: "4",
    name: "Robert Wilson",
    age: 71,
    roomNumber: "ICU-104",
    bedNumber: "A",
    admissionDate: "2024-01-13",
    condition: "normal",
    vitals: {
      heartRate: 68,
      oxygenSaturation: 97,
      temperature: 36.5,
      bloodPressure: { systolic: 118, diastolic: 75 },
      respiratoryRate: 14,
    },
  },
];

export default function Home() {
  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patient Monitoring</h2>
        <p className="text-gray-600">
          Real-time vital signs and patient status
        </p>
      </div>

      <HomePage mockPatients={mockPatients} />
    </div>
  );
}
