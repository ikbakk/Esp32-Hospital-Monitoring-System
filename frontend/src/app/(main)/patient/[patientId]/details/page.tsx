import PatientCriticalAlerts from "@/components/patientCriticalAlerts";
import PatientVitalTrends from "@/components/patientVitalTrends";
import TimeRangeSelector from "@/components/timeRangeSelector";

// Mock historical data for vital signs
const generateVitalHistory = (
  baseValue: number,
  variance: number,
  hours = 24,
) => {
  const data = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const value = baseValue + (Math.random() - 0.5) * variance;
    data.push({
      time: time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: time,
      value: Math.round(value * 10) / 10,
    });
  }
  return data;
};

const patientVitalHistory = {
  "Sarah Johnson": {
    heartRate: generateVitalHistory(72, 10),
    temperature: generateVitalHistory(36.8, 1),
    oxygenSat: generateVitalHistory(98, 3),
    bloodPressure: generateVitalHistory(120, 15).map((item) => ({
      ...item,
      systolic: item.value,
      diastolic: item.value - 40,
    })),
  },
  "Michael Chen": {
    heartRate: generateVitalHistory(95, 15),
    temperature: generateVitalHistory(37.8, 1.5),
    oxygenSat: generateVitalHistory(94, 4),
    bloodPressure: generateVitalHistory(140, 20).map((item) => ({
      ...item,
      systolic: item.value,
      diastolic: item.value - 50,
    })),
  },
  "Emma Rodriguez": {
    heartRate: generateVitalHistory(110, 20),
    temperature: generateVitalHistory(39.2, 2),
    oxygenSat: generateVitalHistory(89, 5),
    bloodPressure: generateVitalHistory(160, 25).map((item) => ({
      ...item,
      systolic: item.value,
      diastolic: item.value - 60,
    })),
  },
  "Robert Wilson": {
    heartRate: generateVitalHistory(68, 8),
    temperature: generateVitalHistory(36.5, 0.8),
    oxygenSat: generateVitalHistory(97, 2),
    bloodPressure: generateVitalHistory(118, 12).map((item) => ({
      ...item,
      systolic: item.value,
      diastolic: item.value - 43,
    })),
  },
};

export default function GraphsPage() {
  const currentPatientData = patientVitalHistory["Sarah Johnson"];
  return (
    <div className="p-6">
      <div className="flex mb-4 w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Patient Vital Signs Analytics
          </h2>
          <p className="text-muted-foreground">
            Real-time monitoring and historical trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          Timeframe:
          <TimeRangeSelector />
        </div>
      </div>
      <PatientVitalTrends currentPatientData={currentPatientData} />
      <PatientCriticalAlerts />
    </div>
  );
}
