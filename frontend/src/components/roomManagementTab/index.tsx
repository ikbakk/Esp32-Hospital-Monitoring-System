"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserX } from "lucide-react";
import { getStatusColor, getStatusIcon } from "@/lib/utils/settingPage";
import type { Room } from "@/types/room";

export default function RoomManagementTab({
  rooms,
  onDischarge,
  onStatusChange,
}: {
  rooms: Room[];
  onDischarge: (roomId: string) => void;
  onStatusChange: (roomId: string, status: Room["status"]) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Status Management</CardTitle>
        <CardDescription>
          Manage patient discharges and room status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${getStatusColor(room.status)} text-white`}
                >
                  {getStatusIcon(room.status)}
                </div>
                <div>
                  <div className="font-semibold">{room.number}</div>
                  <div className="text-sm text-muted-foreground">
                    {room.patientName || `${room.status} • ${room.bedType}`}
                  </div>
                  {room.lastCleaned && (
                    <div className="text-xs text-muted-foreground">
                      Last cleaned: {room.lastCleaned}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={room.status === "occupied" ? "default" : "secondary"}
                >
                  {room.status}
                </Badge>
                {room.status === "occupied" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDischarge(room.id)}
                    className="text-red-600"
                  >
                    <UserX className="w-4 h-4 mr-1" /> Discharge
                  </Button>
                ) : (
                  <Select
                    value={room.status}
                    onValueChange={(v: Room["status"]) =>
                      onStatusChange(room.id, v)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
