import { Activity, Edit, Phone, User } from "lucide-react";
import Link from "next/link";
import RecordDetailTabs from "@/components/recordDetailTabs";
import RecordOverviewCard from "@/components/recordOverviewCard";
import { Button } from "@/components/ui/button";

const PatientRecordPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/records">
            <Button variant="ghost" className="mb-2 cursor-pointer">
              ← Back to Patient List
            </Button>
          </Link>
          <h2 className="text-2xl font-bold text-foreground">
            {"selectedPatient.name"}
          </h2>
          <p className="text-muted-foreground">
            {"selectedPatient.roomNumber"} - Bed {"selectedPatient.bedNumber"}
          </p>
        </div>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Edit Record
        </Button>
      </div>

      {/* Patient Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecordOverviewCard
          icon={<User className="w-4 h-4 mr-2" />}
          title="Patient Information"
          patientInformations={[
            {
              title: "Date of Birth",
              value: "3/15/1979",
            },
            {
              title: "Gender",
              value: "Male",
            },
            {
              title: "Blood Type",
              value: "A+",
            },
          ]}
        />
        <RecordOverviewCard
          title={"Contact Information"}
          icon={<Phone className="w-4 h-4 mr-2" />}
          patientInformations={[
            {
              title: "Phone Number",
              value: "123-456-7890",
            },
            {
              title: "Email",
              value: "Xx4oE@example.com",
            },
            {
              title: "Emergency Contact",
              value: "John Johnson (Husband)",
            },
          ]}
        />
        <RecordOverviewCard
          title={"Care Team"}
          icon={<Activity className="w-4 h-4 mr-2" />}
          patientInformations={[
            {
              title: "Primary Care Provider",
              value: "Dr. Smith",
            },
            {
              title: "Secondary Care Provider",
              value: "Dr. Johnson",
            },
            {
              title: "Nurse",
              value: "Nurse Smith",
            },
          ]}
        />
      </div>

      {/* Detailed Information Tabs */}
      <RecordDetailTabs
        medicalHistory={[]}
        currentMedications={[]}
        allergies={[]}
      />
    </div>
  );
};
export default PatientRecordPage;
