
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
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('user_id', user?.id)
        .eq('category', category);

      if (error) throw error;
      fetchSales();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset sales history",
      });
    }
  };

  const handleSaleDelete = async (saleId: string) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sale record deleted successfully",
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
