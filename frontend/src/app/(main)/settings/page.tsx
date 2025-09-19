import SettingsPage from "@/components/pages/settings";
import { Settings } from "lucide-react";

export default function SettingsPageServer() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" /> Hospital Ward Settings
          </h2>
          <p className="text-muted-foreground">
            Manage rooms, patients, and display preferences
          </p>
        </div>
      </div>

      <SettingsPage />
    </div>
  );
}
