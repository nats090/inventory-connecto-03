
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@/types/inventory";
import { formatDate } from "@/lib/utils";
import { Download, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useActivities } from "@/hooks/useActivities";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityLogsProps {
  activities: Activity[];
}

const ActivityLogs = ({ activities }: ActivityLogsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { fetchActivities } = useActivities(user?.id);
  
  const handleDownloadLogs = () => {
    const content = `Activity Logs Report\n` +
      `Generated on: ${new Date().toLocaleString()}\n\n` +
      activities.map(activity => 
        `Action: ${activity.action}\n` +
        `Details: ${activity.details}\n` +
        `Time: ${formatDate(activity.timestamp)}\n` +
        `----------------------------------------`
      ).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Activity logs have been downloaded",
    });
  };

  const handleResetLogs = async () => {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchActivities();

      toast({
        title: "Success",
        description: "Activity logs have been reset",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset activity logs",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Activity Logs</CardTitle>
        {activities.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadLogs}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetLogs}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        )}
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
