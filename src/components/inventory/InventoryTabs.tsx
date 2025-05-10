
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryItem } from "@/types/inventory";
import InventoryList from "./InventoryList";
import { EggFried, Beef, Fish, Scissors } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InventoryTabsProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onReduceQuantity: (item: InventoryItem, quantity: number) => void;
}

const CATEGORIES = ["chicken", "pork", "beef", "fish"] as const;

const CategoryIcons = {
  chicken: EggFried,
  pork: Scissors, // Using Scissors as a better representation for pork (like meat cutting)
  beef: Beef,
  fish: Fish
};

const CategoryColors = {
  chicken: "bg-amber-100 text-amber-800",
  pork: "bg-pink-100 text-pink-800",
  beef: "bg-red-100 text-red-800",
  fish: "bg-blue-100 text-blue-800"
};

const InventoryTabs = ({ items, onEditItem, onDeleteItem, onReduceQuantity }: InventoryTabsProps) => {
  return (
    <Tabs defaultValue="chicken" className="w-full">
      <TabsList className="grid grid-cols-4 w-full mb-4 sm:mb-8 bg-cooking-softYellow/40 p-1 sm:p-1.5 rounded-lg sm:rounded-xl">
        {CATEGORIES.map((category) => {
          const Icon = CategoryIcons[category];
          return (
            <TabsTrigger 
              key={category} 
              value={category} 
              className="capitalize data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-base"
            >
              <div className={`p-1 sm:p-1.5 rounded-full ${CategoryColors[category]} flex items-center justify-center`}>
                <Icon className="w-3 h-3 sm:w-5 sm:h-5" />
              </div>
              <span className="hidden xs:inline">{category}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <div className="overflow-hidden"> 
        {CATEGORIES.map((category) => (
          <TabsContent key={category} value={category} className="mt-0 animate-fade-in">
            <div className="content-card p-3 sm:p-6">
              <h3 className="mb-4 sm:mb-6 capitalize flex items-center bg-white py-2">
                <div className={`p-1 sm:p-1.5 rounded-full ${CategoryColors[category]} flex items-center justify-center mr-2`}>
                  {React.createElement(CategoryIcons[category], { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                </div>
                {category} Inventory
              </h3>
              <InventoryList
                items={items.filter((item) => item.category === category)}
                onEditItem={onEditItem}
                onDeleteItem={onDeleteItem}
                onReduceQuantity={onReduceQuantity}
              />
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default InventoryTabs;
