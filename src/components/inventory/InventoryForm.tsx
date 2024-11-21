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

interface InventoryFormProps {
  newItem: Partial<InventoryItem>;
  setNewItem: (item: Partial<InventoryItem>) => void;
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
    <Card>
      <CardHeader>
        <CardTitle>{editingItem ? "Edit Item" : "Add New Item"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
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
          <Select
            value={editingItem ? editingItem.category : newItem.category}
            onValueChange={(value) =>
              editingItem
                ? setEditingItem({ ...editingItem, category: value })
                : setNewItem({ ...newItem, category: value })
            }
            required
          >
            <SelectTrigger>
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
  );
};

export default InventoryForm;