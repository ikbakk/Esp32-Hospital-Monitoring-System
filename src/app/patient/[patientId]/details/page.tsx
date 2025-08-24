import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GraphsPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Patient Vital Signs Analytics
          </h2>
          <p className="text-muted-foreground">
            Real-time monitoring and historical trends
          </p>
        </div>
        <div className="flex gap-3">
          {/* <Select value={selectedPatient} onValueChange={setSelectedPatient}> */}
          {/*   <SelectTrigger className="w-[200px]"> */}
          {/*     <SelectValue placeholder="Select patient" /> */}
          {/*   </SelectTrigger> */}
          {/*   <SelectContent> */}
          {/*     {Object.keys(patientVitalHistory).map((patient) => ( */}
          {/*       <SelectItem key={patient} value={patient}> */}
          {/*         {patient} */}
          {/*       </SelectItem> */}
          {/*     ))} */}
          {/*   </SelectContent> */}
          {/* </Select> */}
          {/* <Select value={timeRange} onValueChange={setTimeRange}> */}
          {/*   <SelectTrigger className="w-[120px]"> */}
          {/*     <SelectValue placeholder="Time range" /> */}
          {/*   </SelectTrigger> */}
          {/*   <SelectContent> */}
          {/*     <SelectItem value="6h">Last 6h</SelectItem> */}
          {/*     <SelectItem value="12h">Last 12h</SelectItem> */}
          {/*     <SelectItem value="24h">Last 24h</SelectItem> */}
          {/*     <SelectItem value="48h">Last 48h</SelectItem> */}
          {/*   </SelectContent> */}
          {/* </Select> */}
        </div>
      </div>
    </div>
  );
}
