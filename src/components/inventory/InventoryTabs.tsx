
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryItem } from "@/types/inventory";
import InventoryList from "./InventoryList";

interface InventoryTabsProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onReduceQuantity: (item: InventoryItem, quantity: number) => void;
}

const CATEGORIES = ["chicken", "pork", "beef", "fish"] as const;

const InventoryTabs = ({ items, onEditItem, onDeleteItem, onReduceQuantity }: InventoryTabsProps) => {
  return (
    <Tabs defaultValue="chicken" className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        {CATEGORIES.map((category) => (
          <TabsTrigger key={category} value={category} className="capitalize">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>

      {CATEGORIES.map((category) => (
        <TabsContent key={category} value={category}>
          <InventoryList
            items={items.filter((item) => item.category === category)}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
            onReduceQuantity={onReduceQuantity}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default InventoryTabs;
