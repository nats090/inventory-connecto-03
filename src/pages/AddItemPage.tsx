
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryItem } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActivities } from "@/hooks/useActivities";

const CATEGORIES = ["chicken", "pork", "beef", "fish"] as const;

const AddItemPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addActivity } = useActivities(user?.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [item, setItem] = useState<Partial<InventoryItem>>({
    name: "",
    quantity: 0,
    price: 0,
    category: "chicken"
  });

  // Check if we're editing an existing item (passed through state)
  useEffect(() => {
    if (location.state?.editItem) {
      const editItem = location.state.editItem as InventoryItem;
      setItem({
        name: editItem.name,
        quantity: editItem.quantity,
        price: editItem.price,
        category: editItem.category
      });
      setIsEditing(true);
      setEditingItemId(editItem.id);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      if (!item.name || !item.category || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields",
        });
        return;
      }

      if (isEditing && editingItemId) {
        // Update existing item
        const { error } = await supabase
          .from('inventory_items')
          .update({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
          })
          .eq('id', editingItemId);

        if (error) throw error;
        
        await addActivity(`Updated item: ${item.name}`);
        toast({
          title: "Success",
          description: "Item updated successfully",
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('inventory_items')
          .insert({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
            user_id: user.id
          });

        if (error) throw error;

        await addActivity(`Added new item: ${item.name}`);
        toast({
          title: "Success",
          description: "Item added successfully",
        });
      }

      // Reset form
      setItem({
        name: "",
        quantity: 0,
        price: 0,
        category: "chicken"
      });
      setIsEditing(false);
      setEditingItemId(null);
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-cooking-softOrange/20 overflow-hidden shadow-lg card-gradient">
        <CardHeader className="border-b border-cooking-softOrange/10 pb-3 bg-gradient-to-r from-cooking-softYellow/30 to-transparent">
          <CardTitle className="text-2xl text-amber-800 font-playfair">
            {isEditing ? "Edit Item" : "Add New Item"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="item-name" className="text-sm font-medium">Item Name</label>
              <Input
                id="item-name"
                placeholder="What's cooking?"
                value={item.name}
                onChange={(e) => setItem((prev) => ({ ...prev, name: e.target.value }))}
                className="border-cooking-softOrange/20 focus-visible:ring-primary/20"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={item.quantity || ""}
                  onChange={(e) => setItem((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  className="border-cooking-softOrange/20 focus-visible:ring-primary/20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">Price</label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={item.price || ""}
                  onChange={(e) => setItem((prev) => ({ ...prev, price: Number(e.target.value) }))}
                  className="border-cooking-softOrange/20 focus-visible:ring-primary/20"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select
                value={item.category}
                onValueChange={(value) => setItem((prev) => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger id="category" className="border-cooking-softOrange/20 focus-visible:ring-primary/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Updating Item..." : "Update Item"}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Adding Item..." : "Add Item"}
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="border-cooking-softOrange/20 hover:bg-cooking-softOrange/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddItemPage;
