
import ActivityLogs from "@/components/inventory/ActivityLogs";
import { useActivities } from "@/hooks/useActivities";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { startOfToday, startOfWeek, startOfMonth } from "date-fns";

type DateFilter = "today" | "week" | "month" | "all";

const ActivityLogsPage = () => {
  const { user } = useAuth();
  const { activities, isLoading, fetchActivities, resetActivities } = useActivities(user?.id);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [filteredActivities, setFilteredActivities] = useState(activities);

  // Force refresh of activities after reset
  const handleLogsReset = async () => {
    const success = await resetActivities();
    if (success) {
      setRefreshKey(prev => prev + 1);
    }
    return success;
  };

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, refreshKey]);

  useEffect(() => {
    filterActivitiesByDate(dateFilter);
  }, [dateFilter, activities]);

  const filterActivitiesByDate = (filter: DateFilter) => {
    if (filter === "all") {
      setFilteredActivities(activities);
      return;
    }

    let startDate: Date;
    const now = new Date();

    switch (filter) {
      case "today":
        startDate = startOfToday();
        break;
      case "week":
        startDate = startOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        break;
      default:
        setFilteredActivities(activities);
        return;
    }

    const filtered = activities.filter(activity => 
      new Date(activity.timestamp) >= startDate
    );
    
    setFilteredActivities(filtered);
  };

  return (
    <div className="p-8 bg-cooking-pattern bg-opacity-5">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-playfair text-amber-900">Activity History</h1>
        <div className="w-[200px]">
          <Select 
            value={dateFilter} 
            onValueChange={(value) => setDateFilter(value as DateFilter)}
          >
            <SelectTrigger className="border-amber-300 bg-cooking-softPeach/70">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="today">Today's Activities</SelectItem>
              <SelectItem value="week">This Week's Activities</SelectItem>
              <SelectItem value="month">This Month's Activities</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-[500px]">
        <ScrollArea className="h-full">
          <ActivityLogs 
            activities={filteredActivities} 
            onLogsReset={handleLogsReset}
            isLoading={isLoading}
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default ActivityLogsPage;
