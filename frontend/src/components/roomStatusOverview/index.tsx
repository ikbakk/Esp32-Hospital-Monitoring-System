"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Room } from "@/types/room";

export default function RoomStatusOverview({ rooms }: { rooms: Room[] }) {
  const counts = {
    occupied: rooms.filter((r) => r.status === "occupied").length,
    available: rooms.filter((r) => r.status === "available").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
    disabled: rooms.filter((r) => r.status === "disabled").length,
  };

  const stats = [
    { label: "Occupied", count: counts.occupied, color: "blue" },
    { label: "Available", count: counts.available, color: "emerald" },
    { label: "Maintenance", count: counts.maintenance, color: "amber" },
    { label: "Disabled", count: counts.disabled, color: "gray" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, count, color }) => (
        <Card key={label}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
            </div>
            <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
