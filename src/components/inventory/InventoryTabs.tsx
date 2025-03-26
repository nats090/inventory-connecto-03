
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryItem } from "@/types/inventory";
import InventoryList from "./InventoryList";
import { EggFried, Banana, Beef, Fish } from "lucide-react";

interface InventoryTabsProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onReduceQuantity: (item: InventoryItem, quantity: number) => void;
}

const CATEGORIES = ["chicken", "pork", "beef", "fish"] as const;

const CategoryIcons = {
  chicken: EggFried,
  pork: Banana, // Using Banana as a substitute since there's no direct pork icon
  beef: Beef,
  fish: Fish
};

const InventoryTabs = ({ items, onEditItem, onDeleteItem, onReduceQuantity }: InventoryTabsProps) => {
  return (
    <Tabs defaultValue="chicken" className="w-full">
      <TabsList className="grid grid-cols-4 w-full mb-6 bg-cooking-softYellow/40 p-1">
        {CATEGORIES.map((category) => {
          const Icon = CategoryIcons[category];
          return (
            <TabsTrigger 
              key={category} 
              value={category} 
              className="capitalize data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center gap-1.5"
            >
              <Icon className="w-4 h-4" />
              {category}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {CATEGORIES.map((category) => (
        <TabsContent key={category} value={category} className="mt-0">
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
