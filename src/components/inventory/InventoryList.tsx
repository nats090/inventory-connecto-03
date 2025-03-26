
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";
import { formatDate } from "@/lib/utils";
import ReduceQuantityDialog from "./ReduceQuantityDialog";
import { Edit, Trash2, ExternalLink, Utensils } from "lucide-react";

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
      {items.length === 0 && (
        <div className="text-center py-12 bg-white/50 rounded-lg border border-cooking-softOrange/20">
          <Utensils className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-muted-foreground">No items</h3>
          <p className="mt-1 text-sm text-muted-foreground">Add your first item in this category.</p>
        </div>
      )}
      
      {items.map((item) => (
        <Card key={item.id} className="card-hover overflow-hidden card-gradient border-cooking-softOrange/20">
          <CardContent className="p-0">
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 
                  className="font-semibold text-lg text-primary hover:text-primary/80 cursor-pointer flex items-center" 
                  onClick={() => handleItemNameClick(item.name)}
                >
                  {item.name}
                  <ExternalLink className="ml-2 h-3 w-3 opacity-60" />
                </h3>
                <div className="grid grid-cols-2 gap-x-4 mt-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="ml-1 font-medium">{item.quantity}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="ml-1 font-medium">${item.price}</span>
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Added on: {formatDate(item.created_at)}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditItem(item)}
                  className="h-8 border-cooking-softOrange/30 hover:border-cooking-softOrange/50 hover:bg-cooking-softOrange/10"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="ml-1.5">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteItem(item.id)}
                  className="h-8 border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="ml-1.5">Delete</span>
                </Button>
                <Button
                  className="h-8 bg-primary hover:bg-primary/90"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsReduceDialogOpen(true);
                  }}
                >
                  <Utensils className="h-3.5 w-3.5" />
                  <span className="ml-1.5">Reduce</span>
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
