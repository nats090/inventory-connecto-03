
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "@/types/inventory";
import { formatDate } from "@/lib/utils";
import { Download, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ActivityLogsProps {
  activities: Activity[];
  onLogsReset: () => Promise<void>;
  isLoading: boolean;
}

const ActivityLogs = ({ activities, onLogsReset, isLoading = false }: ActivityLogsProps) => {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  
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
      setIsResetting(true);
      
      // Call the parent component's callback to reset logs
      await onLogsReset();
      
      toast({
        title: "Success",
        description: "Activity logs have been reset",
      });
    } catch (error) {
      console.error("Error resetting logs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset activity logs",
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <Card className="bg-cooking-softPeach border-cooking-softOrange shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-cooking-softOrange/30">
        <CardTitle className="font-playfair text-xl text-amber-800">Activity Logs</CardTitle>
        {activities.length > 0 && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadLogs}
              className="bg-cooking-softGreen hover:bg-cooking-softGreen/80 text-amber-800 border-amber-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetLogs}
              disabled={isResetting || isLoading}
              className="bg-red-400 hover:bg-red-500 text-white border-none"
            >
              <RotateCcw className={`h-4 w-4 mr-2 ${isResetting ? "animate-spin" : ""}`} />
              {isResetting ? "Resetting..." : "Reset"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-2">
          {activities.length === 0 ? (
            <p className="text-amber-700 text-center italic">No activities recorded yet.</p>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={index} 
                className="text-sm bg-white/70 p-3 rounded-lg shadow-sm border border-cooking-softOrange/20 hover:bg-white transition-colors"
              >
                <span className="font-medium text-amber-800">{activity.action}</span>
                <span className="text-amber-600"> - {formatDate(activity.timestamp)}</span>
                <p className="text-amber-700 mt-1">{activity.details}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;
