import { Separator } from "@radix-ui/react-separator";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Badge } from "../ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ConditionType {
  title: "warning" | "critical" | "normal";
}

interface WardStatusProps {
  patientCount: Record<ConditionType["title"], number>;
}

const patientConditions: ConditionType[] = [
  { title: "critical" },
  { title: "warning" },
  { title: "normal" },
];

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "normal":
      return "bg-emerald-500";
    case "warning":
      return "bg-amber-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getConditionIcon = (condition: string) => {
  switch (condition) {
    case "normal":
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "critical":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const WardStatus = ({ patientCount }: WardStatusProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Ward Status</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {patientConditions.map((condition) => (
            <SidebarMenuItem key={condition.title}>
              <SidebarMenuButton asChild>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getConditionIcon(condition.title)}
                    <span className="capitalize">{condition.title}</span>
                  </div>

                  <Badge
                    variant="secondary"
                    className={`${getConditionColor(condition.title)} text-white`}
                  >
                    {patientCount[condition.title]}
                  </Badge>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default WardStatus;
