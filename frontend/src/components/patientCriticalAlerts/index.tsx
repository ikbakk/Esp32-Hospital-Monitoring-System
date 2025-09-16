import { AlertTriangle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const PatientCriticalAlerts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Recent Critical Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium text-red-900">
                  Emma Rodriguez - ICU-103
                </p>
                <p className="text-sm text-red-700">
                  Oxygen saturation dropped to 89%
                </p>
              </div>
            </div>
            <Badge variant="destructive">Critical</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <div>
                <p className="font-medium text-amber-900">
                  Michael Chen - ICU-102
                </p>
                <p className="text-sm text-amber-700">
                  Elevated temperature: 37.8°C
                </p>
              </div>
            </div>
            <Badge variant="secondary">Warning</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCriticalAlerts;
