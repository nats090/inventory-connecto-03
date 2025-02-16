
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";
import { formatDate } from "@/lib/utils";
import ReduceQuantityDialog from "./ReduceQuantityDialog";

interface InventoryListProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onReduceQuantity: (item: InventoryItem, quantity: number) => void;
}

const InventoryList = ({ items, onEditItem, onDeleteItem, onReduceQuantity }: InventoryListProps) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isReduceDialogOpen, setIsReduceDialogOpen] = useState(false);

  const handleItemNameClick = (itemName: string) => {
    const searchQuery = encodeURIComponent(itemName);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {item.name}
                </h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
                <p>Category: {item.category}</p>
                <p className="text-sm text-muted-foreground">
                  Added on: {formatDate(item.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditItem(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleItemNameClick(item.name)}
                  className="hover:bg-secondary/90 transition-colors"
                >
                  Details
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteItem(item.id)}
                >
                  Delete
                </Button>
                <Button
                  className="bg-blue-700 hover:bg-blue-800"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsReduceDialogOpen(true);
                  }}
                >
                  Reduce
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedItem && (
        <ReduceQuantityDialog
          item={selectedItem}
          isOpen={isReduceDialogOpen}
          onClose={() => {
            setIsReduceDialogOpen(false);
            setSelectedItem(null);
          }}
          onConfirm={(item, quantity) => {
            onReduceQuantity(item, quantity);
          }}
        />
      )}
    </div>
  );
};

export default InventoryList;
