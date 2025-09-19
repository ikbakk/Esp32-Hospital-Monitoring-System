"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DisplaySettingsTab({
  settings,
  setSettings,
}: {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Home Page Display Settings</CardTitle>
        <CardDescription>Configure how rooms are displayed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Show Empty Rooms</Label>
          <Switch
            checked={settings.showEmptyRooms}
            onCheckedChange={(v) =>
              setSettings({ ...settings, showEmptyRooms: v })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Show Maintenance Rooms</Label>
          <Switch
            checked={settings.showMaintenanceRooms}
            onCheckedChange={(v) =>
              setSettings({ ...settings, showMaintenanceRooms: v })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Show Disabled Rooms</Label>
          <Switch
            checked={settings.showDisabledRooms}
            onCheckedChange={(v) =>
              setSettings({ ...settings, showDisabledRooms: v })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Default Empty Room Text</Label>
          <Input
            value={settings.defaultEmptyRoomText}
            onChange={(e) =>
              setSettings({ ...settings, defaultEmptyRoomText: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Auto-hide Empty Rooms After (hours)</Label>
          <Input
            type="number"
            value={settings.autoHideEmptyAfter}
            onChange={(e) =>
              setSettings({
                ...settings,
                autoHideEmptyAfter: parseInt(e.target.value),
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
