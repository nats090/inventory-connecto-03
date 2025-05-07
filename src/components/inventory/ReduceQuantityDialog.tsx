
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryItem } from "@/types/inventory";
import { Utensils, AlertCircle, Plus, Minus, PhilippinePeso } from "lucide-react";

interface ReduceQuantityDialogProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: InventoryItem, quantity: number) => void;
}

const ReduceQuantityDialog = ({
  item,
  isOpen,
  onClose,
  onConfirm,
}: ReduceQuantityDialogProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(item, quantity);
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < item.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-gradient border-cooking-softOrange/20">
        <DialogHeader className="pb-2 border-b border-cooking-softOrange/10">
          <DialogTitle className="flex items-center text-primary">
            <Utensils className="mr-2 h-5 w-5" />
            {item.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Price: <PhilippinePeso className="inline h-3.5 w-3.5" />{item.price}</p>
              <p className="text-sm text-muted-foreground mb-4">Available stock: {item.quantity}</p>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="quantity">Quantity to reduce</Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 border-cooking-softOrange/20"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={item.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 mx-2 text-center border-cooking-softOrange/20 focus-visible:ring-primary/20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= item.quantity}
                  className="h-10 w-10 border-cooking-softOrange/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <p className="font-medium">Total: <PhilippinePeso className="inline h-3.5 w-3.5" />{item.price * quantity}</p>
            </div>
            
            {item.quantity <= 5 && (
              <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <p>Low stock warning: Only {item.quantity} items left</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-cooking-softOrange/20 hover:bg-cooking-softOrange/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={quantity < 1 || quantity > item.quantity}
            >
              Confirm Sale
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReduceQuantityDialog;
