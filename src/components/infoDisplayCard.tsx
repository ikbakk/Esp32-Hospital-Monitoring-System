import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useMemo } from "react";
import { Heart, Thermometer, Percent } from "lucide-react";

type Status = "normal" | "warning" | "critical";

interface InfoDisplayCardProps {
  title: string;
  status: Status;
}

const getStatusColor = (status: Status) => {
  const statusColors: Record<Status, string> = {
    normal: "bg-green-300",
    warning: "bg-yellow-300",
    critical: "bg-red-300",
  };

  return statusColors[status];
};

const InfoDisplayCard = ({ status, title }: InfoDisplayCardProps) => {
  const cardHeaderColor = useMemo(
    () => getStatusColor(status || "normal"),
    [status],
  );

  return (
    <Card className="w-60 overflow-hidden border border-primary">
      <CardHeader
        className={cn(
          "-mt-6 flex pt-4 pb-3 items-center justify-center",
          cardHeaderColor,
        )}
      >
        <CardTitle className="text-primary">{title || "Card Title"}</CardTitle>
      </CardHeader>
      <CardContent>
        <InfoDisplayCardContent
          heartRate={0}
          temperature={0}
          oxygenPercentage={0}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        Footer
      </CardFooter>
    </Card>
  );
};

function InfoDisplayCardContent({
  heartRate,
  temperature,
  oxygenPercentage,
}: {
  heartRate: number;
  temperature: number;
  oxygenPercentage: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div>
          <Heart />
        </div>
        <div>{heartRate || 0}</div>
      </div>

      <div className="flex justify-between">
        <div>
          <Percent />
        </div>
        <div>{oxygenPercentage || 0}</div>
      </div>

      <div className="flex justify-between">
        <div>
          <Thermometer />
        </div>
        <div>{temperature || 0}</div>
      </div>
    </div>
  );
}

export default InfoDisplayCard;
