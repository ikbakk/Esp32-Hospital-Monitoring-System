import { RecordPageUIState } from "@/components/pages/records";
import RecordResultSummary from "@/components/recordResultSummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

interface RecordSearchBarProps {
  uiState: RecordPageUIState;
  updateState: (patch: Partial<RecordPageUIState>) => void;
}

export default function RecordSearchBar({
  uiState,
  updateState,
}: RecordSearchBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-full">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search patients or rooms..."
          value={uiState.searchTerm}
          onChange={(e) => updateState({ searchTerm: e.target.value })}
          className="pl-10"
        />
      </div>
      <Button
        variant="default"
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
