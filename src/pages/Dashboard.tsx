
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryItem, Sale } from "@/types/inventory";
import InventoryTabs from "@/components/inventory/InventoryTabs";
import InventoryForm from "@/components/inventory/InventoryForm";
import EarningsDashboard from "@/components/inventory/EarningsDashboard";
import ActivityLogs from "@/components/inventory/ActivityLogs";
import { useActivities } from "@/hooks/useActivities";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { activities, addActivity } = useActivities(user?.id);

  useEffect(() => {
    if (user) {
      fetchInventory();
      fetchSales();
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

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch sales history",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('inventory_items')
          .update({
            name: editingItem.name,
            quantity: editingItem.quantity,
            price: editingItem.price,
            category: editingItem.category,
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        await addActivity(`Updated item: ${editingItem.name}`);
        toast({
          title: "Success",
          description: "Item updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('inventory_items')
          .insert([{ ...newItem, user_id: user.id }]);

        if (error) throw error;

        await addActivity(`Added new item: ${newItem.name}`);
        toast({
          title: "Success",
          description: "Item added successfully",
        });
      }

      setNewItem({});
      setEditingItem(null);
      fetchInventory();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
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

  const handleReduceQuantity = async (item: InventoryItem) => {
    try {
      if (item.quantity <= 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Item is out of stock",
        });
        return;
      }

      const newQuantity = item.quantity - 1;
      const earned = item.price;

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
          quantity_reduced: 1,
          earned,
          category: item.category,
        }]);

      if (saleError) throw saleError;

      await addActivity(`Sold 1 ${item.name} for $${earned}`);
      toast({
        title: "Success",
        description: `Sold 1 ${item.name} for $${earned}`,
      });

      fetchInventory();
      fetchSales();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSalesReset = async (category: string) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('user_id', user?.id)
        .eq('category', category);

      if (error) throw error;

      await addActivity(`Reset sales history for ${category}`);
      fetchSales();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <InventoryForm
              newItem={newItem}
              setNewItem={setNewItem}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
              onSubmit={handleSubmit}
            />
            <div className="mt-8">
              <ActivityLogs activities={activities} />
            </div>
          </div>

          <div className="space-y-8">
            <InventoryTabs
              items={items}
              onEditItem={setEditingItem}
              onDeleteItem={handleDeleteItem}
              onReduceQuantity={handleReduceQuantity}
            />
            <EarningsDashboard 
              sales={sales}
              onSalesReset={handleSalesReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
