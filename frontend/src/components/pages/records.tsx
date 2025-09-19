"use client";

import { useState } from "react";
import type { PatientRecord } from "@/types/PatientRecord";
import { getPatientsList } from "@/hooks/queries/patientQueries";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import RecordSearchBar from "../patientCard/recordSearchBar";
import RecordFilterComponent from "../recordFilterComponent";
import RecordResultSummary from "../recordResultSummary";
import RecordPatientCard from "../recordPatientCard";

interface RecordsPageProps {
  mockPatientRecords: PatientRecord[];
}

type ViewMode = "grid" | "list";

export interface RecordPageUIState {
  searchTerm: string;
  selectedPatient: PatientRecord | undefined;
  filterCondition: string;
  filterRoom: string;
  sortBy: string;
  viewMode: ViewMode;
  showFilters: boolean;
}

const conditionOrder = { critical: 3, warning: 2, normal: 1 };

const RecordsPage = ({ mockPatientRecords }: RecordsPageProps) => {
  const [uiState, setUiState] = useState<RecordPageUIState>({
    searchTerm: "",
    selectedPatient: undefined,
    filterCondition: "all",
    filterRoom: "all",
    sortBy: "name",
    viewMode: "list",
    showFilters: false,
  });

  const updateState = (patch: Partial<RecordPageUIState>) =>
    setUiState((prev) => ({ ...prev, ...patch }));

  const { data: patients } = getPatientsList();
  const filteredPatients = filter(mockPatientRecords, (patient) => {
    const search = uiState.searchTerm.toLowerCase();

    const matchesSearch =
      patient.name.toLowerCase().includes(search) ||
      patient.roomNumber.toLowerCase().includes(search) ||
      patient.id.includes(uiState.searchTerm) ||
      patient.attendingPhysician.toLowerCase().includes(search) ||
      patient.assignedNurse.toLowerCase().includes(search);

    const matchesCondition =
      uiState.filterCondition === "all" ||
      patient.condition === uiState.filterCondition;

    const matchesRoom =
      uiState.filterRoom === "all" ||
      patient.roomNumber.includes(uiState.filterRoom);

    return matchesSearch && matchesCondition && matchesRoom;
  });

  const sortedPatients = orderBy(
    filteredPatients,
    [
      (p) => {
        switch (uiState.sortBy) {
          case "name":
            return p.name;
          case "room":
            return p.roomNumber;
          case "admission":
            return new Date(p.admissionDate).getTime();
          case "condition":
            return conditionOrder[p.condition] || 0;
          default:
            return p.name;
        }
      },
    ],
    [
      uiState.sortBy === "admission" || uiState.sortBy === "condition"
        ? "desc"
        : "asc",
    ],
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex flex-col gap-4">
        <RecordSearchBar uiState={uiState} updateState={updateState} />
        {uiState.showFilters === true && (
          <RecordFilterComponent uiState={uiState} updateState={updateState} />
        )}
        <RecordResultSummary
          patients={patients ?? []}
          sortedPatients={sortedPatients}
          uiState={uiState}
        />
      </div>

      {/* Patient List */}
      <RecordPatientCard
        sortedPatients={sortedPatients}
        updateState={updateState}
        viewMode={uiState.viewMode}
      />
    </div>
  );
};

export default RecordsPage;
