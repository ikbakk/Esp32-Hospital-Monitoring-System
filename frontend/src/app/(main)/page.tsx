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
];

export default function Home() {
  return (
    <div className="flex-1 space-y-6">
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
