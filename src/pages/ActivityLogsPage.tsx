
import ActivityLogs from "@/components/inventory/ActivityLogs";
import { useActivities } from "@/hooks/useActivities";
import { useAuth } from "@/contexts/AuthContext";

const ActivityLogsPage = () => {
  const { user } = useAuth();
  const { activities } = useActivities(user?.id);

  return (
    <div className="p-8">
      <ActivityLogs activities={activities} />
    </div>
  );
};

export default ActivityLogsPage;
