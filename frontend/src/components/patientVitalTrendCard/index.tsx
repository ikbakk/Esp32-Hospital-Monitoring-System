"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface VitalTrendCardProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  color: string;
  unit: string;
  normalRange: string;
}

const VitalTrendCard = ({
  title,
  icon,
  data,
  color,
  unit,
  normalRange,
}: VitalTrendCardProps) => {
  const latestValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
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
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalTrendCard;
