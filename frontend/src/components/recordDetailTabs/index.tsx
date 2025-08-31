import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Allergy,
  MedicalHistory,
  Medication,
} from "@/types/PatientRecord";
import { Button } from "../ui/button";
import { AlertTriangle, Clock, Edit, FileText, Pill, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface RecordDetailTabsProps {
  medicalHistory: MedicalHistory[];
  currentMedications: Medication[];
  allergies: Allergy[];
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "mild":
      return "bg-yellow-100 text-yellow-800";
    case "moderate":
      return "bg-orange-100 text-orange-800";
    case "severe":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "chronic":
      return "bg-blue-100 text-blue-800";
    case "resolved":
      return "bg-gray-100 text-gray-800";
    case "discontinued":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const RecordDetailTabs = ({
  medicalHistory,
  currentMedications,
  allergies,
}: RecordDetailTabsProps) => {
  return (
    <Tabs defaultValue="history" className="space-y-4">
      <TabsList>
        <TabsTrigger value="history">Medical History</TabsTrigger>
        <TabsTrigger value="medications">Medications</TabsTrigger>
        <TabsTrigger value="allergies">Allergies</TabsTrigger>
        <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
      </TabsList>

      <TabsContent value="history" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Medical History</h3>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Condition
          </Button>
        </div>
        <div className="grid gap-4">
          {medicalHistory.map((condition) => (
            <Card key={condition.condition}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{condition.condition}</h4>
                      <Badge className={getStatusColor(condition.status)}>
                        {condition.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Diagnosed:{" "}
                      {new Date(condition.diagnosedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">{condition.notes}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="medications" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Current Medications</h3>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Medication
          </Button>
        </div>
        <div className="grid gap-4">
          {currentMedications.map((medication) => (
            <Card key={medication.name}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold">{medication.name}</h4>
                      <Badge className={getStatusColor(medication.status)}>
                        {medication.status}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">{medication.dosage}</span> -{" "}
                      {medication.frequency}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prescribed by {medication.prescribedBy} on{" "}
                      {new Date(medication.prescribedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="allergies" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Known Allergies</h3>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Allergy
          </Button>
        </div>
        <div className="grid gap-4">
          {allergies.map((allergy) => (
            <Card key={allergy.allergen}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h4 className="font-semibold">{allergy.allergen}</h4>
                      <Badge className={getSeverityColor(allergy.severity)}>
                        {allergy.severity}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Reaction:</span>{" "}
                      {allergy.reaction}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Discovered:{" "}
                      {new Date(allergy.discoveredDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="care-plan" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Current Care Plan</h3>
          <Button size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Plan
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-1" />
              <div className="space-y-2">
                <h4 className="font-semibold">Treatment Plan</h4>
                <p className="text-sm leading-relaxed">
                  Care plan for the patient
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default RecordDetailTabs;
