"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const TimeRangeSelector = () => {
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <Select value={timeRange} onValueChange={setTimeRange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="6h">Last 6h</SelectItem>
        <SelectItem value="12h">Last 12h</SelectItem>
        <SelectItem value="24h">Last 24h</SelectItem>
        <SelectItem value="48h">Last 48h</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimeRangeSelector;
