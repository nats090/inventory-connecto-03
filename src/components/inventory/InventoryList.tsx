
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/types/inventory";
import ReduceQuantityDialog from "./ReduceQuantityDialog";
import { Edit, Trash2, Utensils, PhilippinePeso } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InventoryListProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onReduceQuantity: (item: InventoryItem, quantity: number) => void;
}

const InventoryList = ({ items, onEditItem, onDeleteItem, onReduceQuantity }: InventoryListProps) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isReduceDialogOpen, setIsReduceDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleReduceClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsReduceDialogOpen(true);
  };

  const handleEditClick = (item: InventoryItem) => {
    navigate('/add-item', { state: { editItem: item } });
  };

  return (
    <div>
      {items.length === 0 && (
        <div className="text-center py-12 bg-white/50 rounded-lg border border-cooking-softOrange/20">
          <Utensils className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-muted-foreground">No items</h3>
          <p className="mt-1 text-sm text-muted-foreground">Add your first item in this category.</p>
          <Button 
            className="mt-4 bg-primary hover:bg-primary/90" 
            onClick={() => navigate('/add-item')}
          >
            Add New Item
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            className="h-auto py-4 px-4 flex flex-col items-start text-left border-cooking-softOrange/20 hover:border-cooking-softOrange/50 hover:bg-cooking-softOrange/10 transition-all"
            onClick={() => handleReduceClick(item)}
          >
            <div className="w-full flex justify-between items-start">
              <h3 className="font-semibold text-lg text-primary">{item.name}</h3>
              <div className="flex gap-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(item);
                  }} 
                  className="p-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }} 
                  className="p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 mt-2 text-sm w-full">
              <div className="flex items-center">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="ml-1 font-medium">{item.quantity}</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground">Price:</span>
                <span className="ml-1 font-medium flex items-center">
                  <PhilippinePeso className="h-3 w-3 mr-1" />{item.price}
                </span>
              </div>
            </div>
          </Button>
        ))}
      </div>

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
