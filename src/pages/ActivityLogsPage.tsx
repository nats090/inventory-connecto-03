
import ActivityLogs from "@/components/inventory/ActivityLogs";
import { useActivities } from "@/hooks/useActivities";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const ActivityLogsPage = () => {
  const { user } = useAuth();
  const { activities, isLoading, fetchActivities } = useActivities(user?.id);
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh of activities after reset
  const handleLogsReset = async () => {
    await fetchActivities();
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, refreshKey]);

  return (
    <div className="p-8 bg-cooking-pattern bg-opacity-5">
      <h1 className="text-2xl font-playfair text-amber-900 mb-4">Activity History</h1>
      <ActivityLogs 
        activities={activities} 
        onLogsReset={handleLogsReset}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ActivityLogsPage;
