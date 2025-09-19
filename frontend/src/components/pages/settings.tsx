"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { Room } from "@/types/room";
import RoomStatusOverview from "../roomStatusOverview";
import RoomManagementTab from "../roomManagementTab";
import DisplaySettingsTab from "../displaySettingTab";
import SystemSettingsTab from "../systemSettingsTab";

const mockRooms: Room[] = [
  {
    id: "1",
    number: "ICU-101",
    status: "occupied",
    patientId: "1",
    patientName: "Sarah Johnson",
    bedType: "ICU",
    lastCleaned: "2024-01-19 08:00",
  },
  {
    id: "2",
    number: "ICU-102",
    status: "occupied",
    patientId: "2",
    patientName: "Michael Chen",
    bedType: "ICU",
    lastCleaned: "2024-01-19 08:15",
  },
  {
    id: "3",
    number: "ICU-103",
    status: "occupied",
    patientId: "3",
    patientName: "Emma Rodriguez",
    bedType: "ICU",
    lastCleaned: "2024-01-19 08:30",
  },
  {
    id: "4",
    number: "ICU-104",
    status: "occupied",
    patientId: "4",
    patientName: "Robert Wilson",
    bedType: "ICU",
    lastCleaned: "2024-01-19 08:45",
  },
  {
    id: "5",
    number: "ICU-105",
    status: "available",
    bedType: "ICU",
    lastCleaned: "2024-01-19 09:00",
  },
  {
    id: "6",
    number: "ICU-106",
    status: "maintenance",
    bedType: "ICU",
    lastCleaned: "2024-01-18 14:30",
  },
  {
    id: "7",
    number: "ICU-107",
    status: "available",
    bedType: "ICU",
    lastCleaned: "2024-01-19 09:15",
  },
  {
    id: "8",
    number: "ICU-108",
    status: "disabled",
    bedType: "ICU",
    lastCleaned: "2024-01-17 10:00",
  },
];

export default function SettingsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [displaySettings, setDisplaySettings] = useState({
    showEmptyRooms: true,
    showMaintenanceRooms: false,
    showDisabledRooms: false,
    defaultEmptyRoomText: "Available",
    autoHideEmptyAfter: 24,
  });

  const handleDischarge = (id: string) =>
    setRooms((r) =>
      r.map((room) =>
        room.id === id
          ? {
              ...room,
              status: "available",
              patientId: undefined,
              patientName: undefined,
            }
          : room,
      ),
    );

  const handleStatusChange = (id: string, status: Room["status"]) =>
    setRooms((r) =>
      r.map((room) =>
        room.id === id
          ? { ...room, status, patientId: undefined, patientName: undefined }
          : room,
      ),
    );

  return (
    <div className="">
      <RoomStatusOverview rooms={rooms} />

      <Tabs defaultValue="rooms" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="rooms">Room Management</TabsTrigger>
          <TabsTrigger value="display">Display Settings</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms">
          <RoomManagementTab
            rooms={rooms}
            onDischarge={handleDischarge}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="display">
          <DisplaySettingsTab
            settings={displaySettings}
            setSettings={setDisplaySettings}
          />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
