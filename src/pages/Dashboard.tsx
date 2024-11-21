import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { InventoryItem } from "@/types/inventory";
import InventoryForm from "@/components/inventory/InventoryForm";
import InventoryTabs from "@/components/inventory/InventoryTabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
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
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
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

    setEditingItem(null);
    fetchItems();
  };

  const handleDeleteItem = async (id: string) => {
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

    fetchItems();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Food Stall Inventory</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;