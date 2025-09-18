"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PatientReadings } from "@/types/patient";
import get from "lodash/get";
import last from "lodash/last";
import nth from "lodash/nth";

interface VitalTrendCardProps {
  title: string;
  icon: React.ReactNode;
  data: PatientReadings[];
  dataKey: keyof PatientReadings; // "heartRate" | "spo2" | "bodyTemp"
  color: string;
  unit: string;
  normalRange: string;
}

const VitalTrendCard = ({
  title,
  icon,
  data,
  dataKey,
  color,
  unit,
  normalRange,
}: VitalTrendCardProps) => {
  const transformedData = data.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: reading[dataKey] as number,
  }));

  const latestReading = last(transformedData);
  const previousReading = nth(transformedData, -2);
  const latestValue = get(latestReading, "value", 0);
  const previousValue = get(previousReading, "value", 0);
  const trend = latestValue > previousValue ? "up" : "down";
  const trendColor = trend === "up" ? "text-red-500" : "text-green-500";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {trend === "up" ? (
            <TrendingUp className={`w-4 h-4 ${trendColor}`} />
          ) : (
            <TrendingDown className={`w-4 h-4 ${trendColor}`} />
          )}
          <Badge variant="outline" className="text-xs">
            {normalRange}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {latestValue} {unit}
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Current reading • Normal range: {normalRange}
        </p>

        <ChartContainer
          config={{
            value: { label: title, color },
          }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transformedData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="value"
                    labelFormatter={(value) => `Time: ${value}`}
                  />
                }
              />
              <Line
                type="natural"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VitalTrendCard;
