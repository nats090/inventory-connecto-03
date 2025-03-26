
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryItem } from "@/types/inventory";
import { Dispatch, SetStateAction } from "react";
import { Plus, Save, X } from "lucide-react";

interface InventoryFormProps {
  newItem: Partial<InventoryItem>;
  setNewItem: Dispatch<SetStateAction<Partial<InventoryItem>>>;
  editingItem: InventoryItem | null;
  setEditingItem: (item: InventoryItem | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CATEGORIES = ["chicken", "pork", "beef", "fish"] as const;

const InventoryForm = ({
  newItem,
  setNewItem,
  editingItem,
  setEditingItem,
  onSubmit,
}: InventoryFormProps) => {
  return (
    <Card className="card-gradient border-cooking-softOrange/20">
      <CardHeader className="pb-3 bg-gradient-to-r from-cooking-softYellow/30 to-transparent border-b border-cooking-softOrange/10">
        <CardTitle className="text-xl text-primary">
          {editingItem ? "Edit Item" : "Add New Item"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Item Name</label>
            <Input
              placeholder="What's cooking?"
              value={editingItem ? editingItem.name : newItem.name}
              onChange={(e) =>
                editingItem
                  ? setEditingItem({ ...editingItem, name: e.target.value })
                  : setNewItem((prev) => ({ ...prev, name: e.target.value }))
              }
              className="border-cooking-softOrange/20 focus-visible:ring-primary/20"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                placeholder="0"
                value={editingItem ? editingItem.quantity : newItem.quantity || ""}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, quantity: Number(e.target.value) })
                    : setNewItem((prev) => ({ ...prev, quantity: Number(e.target.value) }))
                }
                className="border-cooking-softOrange/20 focus-visible:ring-primary/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                placeholder="0.00"
                value={editingItem ? editingItem.price : newItem.price || ""}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, price: Number(e.target.value) })
                    : setNewItem((prev) => ({ ...prev, price: Number(e.target.value) }))
                }
                className="border-cooking-softOrange/20 focus-visible:ring-primary/20"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={editingItem ? editingItem.category : newItem.category}
              onValueChange={(value) =>
                editingItem
                  ? setEditingItem({ ...editingItem, category: value })
                  : setNewItem((prev) => ({ ...prev, category: value }))
              }
              required
            >
              <SelectTrigger className="border-cooking-softOrange/20 focus-visible:ring-primary/20">
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
          
          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {editingItem ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Item
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </>
              )}
            </Button>
            {editingItem && (
              <Button
                type="button"
                variant="outline"
                className="border-cooking-softOrange/20 hover:bg-cooking-softOrange/10"
                onClick={() => setEditingItem(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InventoryForm;
