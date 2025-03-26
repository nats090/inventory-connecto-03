
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
import { Utensils, AlertCircle } from "lucide-react";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-gradient border-cooking-softOrange/20">
        <DialogHeader className="pb-2 border-b border-cooking-softOrange/10">
          <DialogTitle className="flex items-center text-primary">
            <Utensils className="mr-2 h-5 w-5" />
            Reduce Quantity: {item.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to reduce</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={item.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border-cooking-softOrange/20 focus-visible:ring-primary/20"
              />
            </div>
            <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <p>Current stock: <span className="font-medium">{item.quantity}</span></p>
            </div>
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
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReduceQuantityDialog;
