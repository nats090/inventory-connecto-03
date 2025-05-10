import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryItem } from "@/types/inventory";
import InventoryTabs from "@/components/inventory/InventoryTabs";
import { useActivities } from "@/hooks/useActivities";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { migrateImageUrlsFromLocalStorage } from "@/utils/migrateImageUrls";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addActivity } = useActivities(user?.id);
  const [migrationRun, setMigrationRun] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInventory();
      
      // Run migration once per session
      if (!migrationRun) {
        migrateImageUrlsFromLocalStorage(user.id);
        setMigrationRun(true);
      }
    }
  }, [user, migrationRun]);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setItems(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch inventory items",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    navigate(`/add-item`, { state: { editItem: item } });
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await addActivity(`Deleted an item`);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      fetchInventory();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleReduceQuantity = async (item: InventoryItem, reduceAmount: number) => {
    try {
      if (item.quantity <= 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Item is out of stock",
        });
        return;
      }

      if (reduceAmount > item.quantity) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Cannot reduce more than available quantity",
        });
        return;
      }

      const newQuantity = item.quantity - reduceAmount;
      const earned = item.price * reduceAmount;

      // If quantity becomes 0, delete the item instead of updating it
      if (newQuantity === 0) {
        const { error: deleteError } = await supabase
          .from('inventory_items')
          .delete()
          .eq('id', item.id);

        if (deleteError) throw deleteError;
        
        // Remove image URL from localStorage
        localStorage.removeItem(`item_image_${item.id}`);

        await addActivity(`Sold all ${item.name} (${reduceAmount} items) for ₱${earned}`);
      } else {
        // Otherwise update the quantity as before
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({ quantity: newQuantity })
          .eq('id', item.id);

        if (updateError) throw updateError;

        await addActivity(`Sold ${reduceAmount} ${item.name} for ₱${earned}`);
      }

      // Record the sale regardless of whether the item was deleted or updated
      const { error: saleError } = await supabase
        .from('sales')
        .insert([{
          user_id: user?.id,
          item_name: item.name,
          quantity_reduced: reduceAmount,
          earned,
          category: item.category,
        }]);

      if (saleError) throw saleError;

      toast({
        title: "Success",
        description: `Sold ${reduceAmount} ${item.name} for ₱${earned}${newQuantity === 0 ? ". Item removed from inventory." : ""}`,
      });

      fetchInventory();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-800 font-playfair m-0">Inventory</h1>
        <Button 
          onClick={() => navigate('/add-item')}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-cooking-softOrange/20 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-cooking-softOrange/20 rounded mb-2"></div>
            <div className="h-3 w-48 bg-cooking-softOrange/10 rounded"></div>
          </div>
        </div>
      ) : (
        <InventoryTabs
          items={items}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onReduceQuantity={handleReduceQuantity}
        />
      )}
    </div>
  );
};

export default Dashboard;
