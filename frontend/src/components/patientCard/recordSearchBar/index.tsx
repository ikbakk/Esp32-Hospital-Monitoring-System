import { RecordPageUIState } from "@/components/pages/records";
import RecordResultSummary from "@/components/recordResultSummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross, Filter, Search, X } from "lucide-react";
import { FormEvent } from "react";

interface RecordSearchBarProps {
  uiState: RecordPageUIState;
  updateState: (patch: Partial<RecordPageUIState>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function RecordSearchBar({
  uiState,
  updateState,
  onSubmit,
}: RecordSearchBarProps) {
  const clearSearchInput = () => {
    updateState({ searchTerm: "" });
  };
  return (
    <div className="flex items-center gap-4">
      <form
        onSubmit={(e) => onSubmit(e)}
        className="relative flex w-full gap-1"
      >
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search patients or rooms..."
          value={uiState.searchTerm}
          onChange={(e) => updateState({ searchTerm: e.target.value })}
          className="pl-10"
        />
        {uiState.searchTerm !== "" && (
          <X
            className="absolute top-1/2 right-24 h-6 w-6 -translate-y-1/2 transform rounded-md p-1 text-muted-foreground duration-100 hover:cursor-pointer hover:bg-destructive hover:text-primary-foreground"
            onClick={clearSearchInput}
          />
        )}
        <Button type="submit">Search</Button>
      </form>
      <Button
        variant="outline"
        onClick={() => updateState({ showFilters: !uiState.showFilters })}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
        {(uiState.filterCondition !== "all" ||
          uiState.filterRoom !== "all") && (
          <Badge variant="secondary" className="ml-1">
            {[
              uiState.filterCondition !== "all" ? 1 : 0,
              uiState.filterRoom !== "all" ? 1 : 0,
            ].reduce((a, b) => a + b)}
          </Badge>
        )}
      </Button>
    </div>
  );
}
