"use client";

import { Activity, Heart, Thermometer } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import VitalTrendCard from "../patientVitalTrendCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PatientVitalTrendsProps {
  currentPatientData: any;
}

const PatientVitalTrends = ({
  currentPatientData,
}: PatientVitalTrendsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VitalTrendCard
        title="Heart Rate"
        icon={<Heart className="w-4 h-4 text-red-500" />}
        data={currentPatientData.heartRate}
        color="hsl(var(--destructive))"
        unit="bpm"
        normalRange="60-100 bpm"
      />
      <VitalTrendCard
        title="Body Temperature"
        icon={<Thermometer className="w-4 h-4 text-orange-500" />}
        data={currentPatientData.temperature}
        color="hsl(var(--chart-3))"
        unit="°C"
        normalRange="36.0-37.5°C"
      />
      <VitalTrendCard
        title="Oxygen Saturation"
        icon={<Activity className="w-4 h-4 text-blue-500" />}
        data={currentPatientData.oxygenSat}
        color="hsl(var(--chart-2))"
        unit="%"
        normalRange="95-100%"
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            Blood Pressure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">
            {Math.round(
              currentPatientData.bloodPressure[
                currentPatientData.bloodPressure.length - 1
              ]?.systolic || 0,
            )}
            /
            {Math.round(
              currentPatientData.bloodPressure[
                currentPatientData.bloodPressure.length - 1
              ]?.diastolic || 0,
            )}{" "}
            mmHg
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Current reading • Normal: &lt;120/80 mmHg
          </p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentPatientData.bloodPressure}>
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
                  dataKey="systolic"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Systolic"
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Diastolic"
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientVitalTrends;
