import { AlertCircle, Bed, SortAsc, Users } from "lucide-react";
import { RecordPageUIState } from "../pages/records";

interface RecordResultSummaryProps {
  patients: any[];
  // TODO: change any to correct type
  sortedPatients: any[];
  // TODO: change any to correct type
  uiState: RecordPageUIState;
}

export default function RecordResultSummary({
  sortedPatients,
  patients,
  uiState,
}: RecordResultSummaryProps) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {sortedPatients.length} of {patients.length} patients
        </span>
        <span className="flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {sortedPatients.filter((p) => p.condition === "critical").length}{" "}
          critical
        </span>
      </div>
      <div className="flex items-center gap-1">
        <SortAsc className="w-4 h-4" />
        Sorted by{" "}
        {uiState.sortBy === "name"
          ? "name"
          : uiState.sortBy === "room"
            ? "room"
            : uiState.sortBy === "admission"
              ? "admission date"
              : "condition priority"}
      </div>
    </div>
  );
}
