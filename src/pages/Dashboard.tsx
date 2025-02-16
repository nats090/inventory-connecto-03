import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { InventoryItem, Sale } from "@/types/inventory";
import InventoryForm from "@/components/inventory/InventoryForm";
import InventoryTabs from "@/components/inventory/InventoryTabs";
import EarningsDashboard from "@/components/inventory/EarningsDashboard";
import ActivityLogs from "@/components/inventory/ActivityLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActivities } from "@/hooks/useActivities";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [userId, setUserId] = useState<string>();
  const { activities, addActivity } = useActivities(userId);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    price: 0,
    category: "",
  });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    checkUser();
    fetchItems();
    fetchSales();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    } else {
      setUserId(session.user.id);
    }
  };

  const fetchItems = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching items:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch inventory items",
      });
      return;
    }

    setItems(data || []);
  };

  const fetchSales = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching sales:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch sales history",
      });
      return;
    }

    setSales(data || []);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("inventory_items")
      .insert([
        {
          ...newItem,
          user_id: session.user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Item added successfully",
    });

    setNewItem({
      name: "",
      quantity: 0,
      price: 0,
      category: "",
    });
    
    addActivity(`Added new item: ${newItem.name}`);
    fetchItems();
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const { data, error } = await supabase
      .from("inventory_items")
      .update({
        name: editingItem.name,
        quantity: editingItem.quantity,
        price: editingItem.price,
        category: editingItem.category,
      })
      .eq("id", editingItem.id)
      .select();

    if (error) {
      console.error("Error updating item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update item",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Item updated successfully",
    });

    addActivity(`Updated item: ${editingItem.name}`);
    setEditingItem(null);
    fetchItems();
  };

  const handleDeleteItem = async (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Item deleted successfully",
    });

    if (itemToDelete) {
      addActivity(`Deleted item: ${itemToDelete.name}`);
    }
    fetchItems();
  };

  const handleReduceQuantity = async (item: InventoryItem) => {
    if (item.quantity <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot reduce quantity below 0",
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const newQuantity = item.quantity - 1;
    const earned = item.price;

    const { error: updateError } = await supabase
      .from("inventory_items")
      .update({ quantity: newQuantity })
      .eq("id", item.id);

    if (updateError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reduce quantity",
      });
      return;
    }

    const newSale = {
      user_id: session.user.id,
      item_name: item.name,
      quantity_reduced: 1,
      earned: earned,
      category: item.category,
    };

    const { error: saleError } = await supabase
      .from("sales")
      .insert([newSale]);

    if (saleError) {
      console.error("Error recording sale:", saleError);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record sale",
      });
      return;
    }

    fetchSales();
    addActivity(`Reduced quantity of ${item.name} by 1, earned $${earned}`);
    fetchItems();
  };

  const handleResetSales = async (category: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("user_id", session.user.id)
      .eq("category", category);

    if (error) {
      console.error("Error resetting sales:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset sales",
      });
      return;
    }

    addActivity(`Reset sales for category: ${category}`);
    fetchSales();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <Tabs defaultValue="inventory" className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Food Stall Inventory</h1>
            <div className="flex gap-4">
              <TabsList>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          <TabsContent value="inventory">
            <div className="grid gap-8 md:grid-cols-2">
              <InventoryForm
                newItem={newItem}
                setNewItem={setNewItem}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              />

              <div>
                <InventoryTabs
                  items={items}
                  onEditItem={setEditingItem}
                  onDeleteItem={handleDeleteItem}
                  onReduceQuantity={handleReduceQuantity}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="earnings">
            <EarningsDashboard sales={sales} onSalesReset={handleResetSales} />
          </TabsContent>

          <TabsContent value="activities">
            <ActivityLogs activities={activities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;