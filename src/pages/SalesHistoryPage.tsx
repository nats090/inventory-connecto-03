import EarningsDashboard from "@/components/inventory/EarningsDashboard";
import { useState, useEffect } from "react";
import { Sale } from "@/types/inventory";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { startOfToday, startOfWeek, startOfMonth, subMonths } from "date-fns";

type DateFilter = "today" | "week" | "month" | "all";

const SalesHistoryPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSales();
    }
  }, [user]);

  useEffect(() => {
    filterSalesByDate(dateFilter);
  }, [dateFilter, allSales]);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setAllSales(data || []);
      setSales(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch sales history",
      });
    }
  };

  const filterSalesByDate = (filter: DateFilter) => {
    if (filter === "all") {
      setSales(allSales);
      return;
    }

    let startDate: Date;
    const now = new Date();

    switch (filter) {
      case "today":
        startDate = startOfToday();
        break;
      case "week":
        startDate = startOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        break;
      default:
        setSales(allSales);
        return;
    }

    const filteredSales = allSales.filter(sale => 
      new Date(sale.timestamp) >= startDate
    );
    
    setSales(filteredSales);
  };

  const handleSalesReset = async (category: string) => {
    try {
      // First, get all sales for this category
      const { data: categorySales, error: fetchError } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user?.id)
        .eq('category', category);

      if (fetchError) throw fetchError;

      // For each sale, restore the quantity to inventory
      for (const sale of categorySales || []) {
        // First get the current inventory item
        const { data: inventoryItem, error: getError } = await supabase
          .from('inventory_items')
          .select('quantity')
          .eq('user_id', user?.id)
          .eq('name', sale.item_name)
          .eq('category', sale.category)
          .single();

        if (getError) throw getError;
        if (!inventoryItem) continue;

        // Then update with the new quantity
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({ 
            quantity: inventoryItem.quantity + sale.quantity_reduced 
          })
          .eq('user_id', user?.id)
          .eq('name', sale.item_name)
          .eq('category', sale.category);

        if (updateError) throw updateError;
      }

      // Then delete all sales for this category
      const { error: deleteError } = await supabase
        .from('sales')
        .delete()
        .eq('user_id', user?.id)
        .eq('category', category);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: `Reset sales history for ${category} and restored quantities`,
      });

      fetchSales();
    } catch (error: any) {
      console.error('Error resetting sales:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset sales history",
      });
    }
  };

  const handleSaleDelete = async (saleId: string) => {
    try {
      // First, get the sale record
      const { data: sale, error: fetchError } = await supabase
        .from('sales')
        .select('*')
        .eq('id', saleId)
        .eq('user_id', user?.id)
        .single();

      if (fetchError) throw fetchError;
      if (!sale) {
        throw new Error('Sale record not found');
      }

      // Get the current inventory item
      const { data: inventoryItem, error: getError } = await supabase
        .from('inventory_items')
        .select('quantity')
        .eq('user_id', user?.id)
        .eq('name', sale.item_name)
        .eq('category', sale.category)
        .single();

      if (getError) throw getError;
      if (!inventoryItem) {
        throw new Error('Inventory item not found');
      }

      // Update the inventory quantity
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          quantity: inventoryItem.quantity + sale.quantity_reduced
        })
        .eq('user_id', user?.id)
        .eq('name', sale.item_name)
        .eq('category', sale.category);

      if (updateError) throw updateError;

      // Delete the sale record
      const { error: deleteError } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId)
        .eq('user_id', user?.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: `Sale record deleted and ${sale.quantity_reduced} items restored to inventory`,
      });
      
      fetchSales();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete sale record",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales History</h1>
        <div className="w-[200px]">
          <Select 
            value={dateFilter} 
            onValueChange={(value) => setDateFilter(value as DateFilter)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sales</SelectItem>
              <SelectItem value="today">Today's Sales</SelectItem>
              <SelectItem value="week">This Week's Sales</SelectItem>
              <SelectItem value="month">This Month's Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <EarningsDashboard 
        sales={sales} 
        onSalesReset={handleSalesReset} 
        onSaleDelete={handleSaleDelete}
      />
    </div>
  );
};

export default SalesHistoryPage;
