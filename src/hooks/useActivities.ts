import { useState, useEffect } from 'react';
import { Activity } from '@/types/inventory';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useActivities = (userId: string | undefined) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  const fetchActivities = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching activities:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch activity logs",
      });
      return;
    }

    console.log('Fetched activities:', data);
    setActivities(data || []);
  };

  const addActivity = async (details: string) => {
    if (!userId) return;

    const newActivity = {
      user_id: userId,
      action: "Inventory Update",
      details,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('activity_logs')
      .insert([newActivity]);

    if (error) {
      console.error('Error adding activity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record activity",
      });
      return;
    }

    fetchActivities();
  };

  useEffect(() => {
    fetchActivities();
  }, [userId]);

  return { activities, addActivity };
};