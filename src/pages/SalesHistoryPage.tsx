
import EarningsDashboard from "@/components/inventory/EarningsDashboard";
import { useState, useEffect } from "react";
import { Sale } from "@/types/inventory";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const SalesHistoryPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSales();
    }
  }, [user]);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch sales history",
      });
    }
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
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({ 
            quantity: supabase.sql`quantity + ${sale.quantity_reduced}` 
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

      // Update the inventory quantity
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          quantity: supabase.sql`quantity + ${sale.quantity_reduced}` 
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
      <EarningsDashboard 
        sales={sales} 
        onSalesReset={handleSalesReset} 
        onSaleDelete={handleSaleDelete}
      />
    </div>
  );
};

export default SalesHistoryPage;
