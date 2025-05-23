
import { useState, useEffect, useCallback } from 'react';
import { Activity } from '@/types/inventory';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useActivities = (userId: string | undefined) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchActivities = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    
    try {
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
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

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

  const resetActivities = async () => {
    if (!userId) return false;

    setIsLoading(true);
    try {
      // Delete all activity logs for this user
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error resetting activities:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to reset activity logs",
        });
        return false;
      }
      
      // Immediately set activities to empty array so UI updates right away
      setActivities([]);
      
      toast({
        title: "Success",
        description: "Activity logs have been reset",
      });
      
      return true;
    } catch (error) {
      console.error('Exception when resetting activities:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { 
    activities, 
    addActivity, 
    fetchActivities, 
    resetActivities,
    isLoading 
  };
};
