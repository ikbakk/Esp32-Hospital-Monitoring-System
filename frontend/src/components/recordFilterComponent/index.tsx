"use client";

import { Grid3X3, List } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RecordPageUIState } from "../pages/records";

interface RecordFilterComponentProps {
  uiState: RecordPageUIState;
  updateState: (patch: Partial<RecordPageUIState>) => void;
}

export default function RecordFilterComponent({
  uiState,
  updateState,
}: RecordFilterComponentProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Condition Status
            </label>
            <Select
              value={uiState.filterCondition}
              onValueChange={(value) => updateState({ filterCondition: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select
              value={uiState.sortBy}
              onValueChange={(value) => updateState({ sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Patient Name</SelectItem>
                <SelectItem value="room">Room Number</SelectItem>
                <SelectItem value="admission">Admission Date</SelectItem>
                <SelectItem value="condition">Condition Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">View Mode</label>
            <div className="flex gap-2">
              <Button
                variant={uiState.viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => updateState({ viewMode: "list" })}
                className="flex-1"
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
              <Button
                variant={uiState.viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => updateState({ viewMode: "grid" })}
                className="flex-1"
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
