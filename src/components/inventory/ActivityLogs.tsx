import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/types/inventory";
import { formatDate } from "@/lib/utils";

interface ActivityLogsProps {
  activities: Activity[];
}

const ActivityLogs = ({ activities }: ActivityLogsProps) => {
  console.log("Rendering ActivityLogs with activities:", activities);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.length === 0 ? (
            <p className="text-muted-foreground">No activities recorded yet.</p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{activity.action}</span>
                <span className="text-muted-foreground"> - {formatDate(activity.timestamp)}</span>
                <p className="text-muted-foreground">{activity.details}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;