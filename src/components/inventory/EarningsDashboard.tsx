import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/inventory";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface EarningsDashboardProps {
  sales: Sale[];
  onSalesReset: (category: string) => void;
}

const CATEGORIES = ["chicken", "pork", "beef", "fish"] as const;

const EarningsDashboard = ({ sales, onSalesReset }: EarningsDashboardProps) => {
  const { toast } = useToast();

  const getSalesByCategory = (category: string) => {
    return sales.filter((sale) => sale.category === category);
  };

  const calculateTotalEarnings = (categorySales: Sale[]) => {
    return categorySales.reduce((total, sale) => total + sale.earned, 0);
  };

  const handleResetCategory = async (category: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('user_id', session.user.id)
        .eq('category', category);

      if (error) throw error;

      onSalesReset(category);
      toast({
        title: "Success",
        description: `Reset sales history for ${category}`,
      });
    } catch (error) {
      console.error('Error resetting sales:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset sales history",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chicken" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((category) => {
            const categorySales = getSalesByCategory(category);
            const totalEarnings = calculateTotalEarnings(categorySales);

            return (
              <TabsContent key={category} value={category}>
                <div className="space-y-4">
                  {categorySales.map((sale, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <h3 className="font-semibold">{sale.itemName}</h3>
                      <p>Quantity reduced: {sale.quantityReduced}</p>
                      <p>Earned: ${sale.earned}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(sale.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {categorySales.length > 0 && (
                    <div className="pt-4 border-t flex justify-between items-center">
                      <p className="font-semibold">Total Earnings: ${totalEarnings}</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleResetCategory(category)}
                      >
                        Reset {category} sales
                      </Button>
                    </div>
                  )}
                  {categorySales.length === 0 && (
                    <p className="text-muted-foreground">No sales recorded for {category}</p>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EarningsDashboard;