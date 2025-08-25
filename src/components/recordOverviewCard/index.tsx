import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type PatientInformation = {
  title: string;
  value: string;
};

interface PatientRecordOverviewProps {
  title: string;
  icon: React.ReactNode;
  patientInformations: PatientInformation[];
}

const RecordOverviewCard = ({
  title,
  icon,
  patientInformations,
}: PatientRecordOverviewProps) => {
  return (
    <Card className="outline outline-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {patientInformations.map((info: PatientInformation) => (
          <div key={info.title + info.value} className="">
            <p className="text-sm text-muted-foreground">{info.title}</p>
            <p className="font-medium">{info.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecordOverviewCard;
