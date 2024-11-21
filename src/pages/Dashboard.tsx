import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { InventoryItem } from "@/types/inventory";

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddItem} className="space-y-4">
                <Input
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: Number(e.target.value) })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: Number(e.target.value) })
                  }
                  required
                />
                <Input
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  required
                />
                <Button type="submit" className="w-full">
                  Add Item
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                      <p>Category: {item.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;