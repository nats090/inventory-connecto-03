
import ActivityLogs from "@/components/inventory/ActivityLogs";
import { useActivities } from "@/hooks/useActivities";
import { useAuth } from "@/contexts/AuthContext";

const ActivityLogsPage = () => {
  const { user } = useAuth();
  const { activities, isLoading } = useActivities(user?.id);

  return (
    <div className="p-8 bg-cooking-pattern bg-opacity-5">
      <h1 className="text-2xl font-playfair text-amber-900 mb-4">Activity History</h1>
      <ActivityLogs activities={activities} />
    </div>
  );
};

export default ActivityLogsPage;
