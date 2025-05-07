import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryItem } from "@/types/inventory";
import InventoryTabs from "@/components/inventory/InventoryTabs";
import { useActivities } from "@/hooks/useActivities";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { addActivity } = useActivities(user?.id);

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
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
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    // In the future, we could navigate to a dedicated edit page
    // For now, we'll just keep the functionality
    navigate(`/add-item`);
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

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ quantity: newQuantity })
        .eq('id', item.id);

      if (updateError) throw updateError;

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

      await addActivity(`Sold ${reduceAmount} ${item.name} for ₱${earned}`);
      toast({
        title: "Success",
        description: `Sold ${reduceAmount} ${item.name} for ₱${earned}`,
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
      
      <InventoryTabs
        items={items}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        onReduceQuantity={handleReduceQuantity}
      />
    </div>
  );
};

export default Dashboard;
