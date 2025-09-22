"use client";

import { FormEvent, useEffect, useState } from "react";
import type { PatientRecord } from "@/types/PatientRecord";
import { getPatientsList } from "@/hooks/queries/patientQueries";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import RecordSearchBar from "../patientCard/recordSearchBar";
import RecordFilterComponent from "../recordFilterComponent";
import RecordResultSummary from "../recordResultSummary";
import RecordPatientCard from "../recordPatientCard";
import {
  getFilteredPatients,
  getPatients,
  getSearchedPatients,
} from "@/hooks/queries/patients";
import { PatientTable } from "@/types/supabase";

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

  const { data: searchResult, refetch: refetchSearch } = getSearchedPatients(
    uiState.searchTerm,
  );
  const { data: patients, refetch: refetchFilter } = getFilteredPatients({
    filterCondition: uiState.filterCondition,
    filterRoom: uiState.filterRoom,
    sortBy: uiState.sortBy,
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetchSearch();
  };

  const handleFilter = () => {
    refetchFilter();
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex flex-col gap-4">
        <RecordSearchBar
          uiState={uiState}
          updateState={updateState}
          onSubmit={handleSearch}
        />
        {uiState.showFilters && (
          <RecordFilterComponent uiState={uiState} updateState={updateState} />
        )}
        <RecordResultSummary
          patients={[]}
          sortedPatients={patients ?? []}
          uiState={uiState}
        />
      </div>
      <RecordPatientCard
        sortedPatients={[]}
        updateState={updateState}
        viewMode={uiState.viewMode}
      />
    </div>
  );
};

export default RecordsPage;
