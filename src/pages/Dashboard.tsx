
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryItem } from "@/types/inventory";
import InventoryTabs from "@/components/inventory/InventoryTabs";
import InventoryForm from "@/components/inventory/InventoryForm";
import { useActivities } from "@/hooks/useActivities";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    quantity: 0,
    price: 0,
    category: "chicken"
  });
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
        if (!newItem.name || !newItem.category || typeof newItem.quantity !== 'number' || typeof newItem.price !== 'number') {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please fill in all required fields",
          });
          return;
        }

        const { error } = await supabase
          .from('inventory_items')
          .insert({
            name: newItem.name,
            quantity: newItem.quantity,
            price: newItem.price,
            category: newItem.category,
            user_id: user.id
          });

        if (error) throw error;

        await addActivity(`Added new item: ${newItem.name}`);
        toast({
          title: "Success",
          description: "Item added successfully",
        });
      }

      setNewItem({
        name: "",
        quantity: 0,
        price: 0,
        category: "chicken"
      });
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
      // First, get the item name before deleting
      const itemToDelete = items.find(item => item.id === id);
      if (!itemToDelete) return;

      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await addActivity(`Deleted item "${itemToDelete.name}"`);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <InventoryForm
            newItem={newItem}
            setNewItem={setNewItem}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            onSubmit={handleSubmit}
          />
        </div>
        <div>
          <InventoryTabs
            items={items}
            onEditItem={setEditingItem}
            onDeleteItem={handleDeleteItem}
            onReduceQuantity={handleReduceQuantity}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
