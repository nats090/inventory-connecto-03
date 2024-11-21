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
          <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingItem ? "Edit Item" : "Add New Item"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
                <Input
                  placeholder="Item Name"
                  value={editingItem ? editingItem.name : newItem.name}
                  onChange={(e) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, name: e.target.value })
                      : setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={editingItem ? editingItem.quantity : newItem.quantity}
                  onChange={(e) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, quantity: Number(e.target.value) })
                      : setNewItem({ ...newItem, quantity: Number(e.target.value) })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={editingItem ? editingItem.price : newItem.price}
                  onChange={(e) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, price: Number(e.target.value) })
                      : setNewItem({ ...newItem, price: Number(e.target.value) })
                  }
                  required
                />
                <Input
                  placeholder="Category"
                  value={editingItem ? editingItem.category : newItem.category}
                  onChange={(e) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, category: e.target.value })
                      : setNewItem({ ...newItem, category: e.target.value })
                  }
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingItem ? "Update Item" : "Add Item"}
                  </Button>
                  {editingItem && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingItem(null)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
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
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ${item.price}</p>
                          <p>Category: {item.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
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