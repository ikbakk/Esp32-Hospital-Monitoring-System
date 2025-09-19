import { Bed, CheckCircle, Wrench, XCircle } from "lucide-react";
import type { Room } from "@/types/room";

export function getStatusColor(status: Room["status"]) {
  switch (status) {
    case "occupied":
      return "bg-blue-500";
    case "available":
      return "bg-emerald-500";
    case "maintenance":
      return "bg-amber-500";
    case "disabled":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

export function getStatusIcon(status: Room["status"]) {
  switch (status) {
    case "occupied":
      return <CheckCircle className="w-4 h-4" />;
    case "available":
      return <Bed className="w-4 h-4" />;
    case "maintenance":
      return <Wrench className="w-4 h-4" />;
    case "disabled":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
}
