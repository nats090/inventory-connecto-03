
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/inventory";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Download, Trash2, PhilippinePeso, Calendar } from "lucide-react";

interface EarningsDashboardProps {
  sales: Sale[];
  onSalesReset: (category: string) => void;
  onSaleDelete: (saleId: string) => void;
}

const CATEGORIES = ["chicken", "pork", "beef", "fish"] as const;

const EarningsDashboard = ({ sales, onSalesReset, onSaleDelete }: EarningsDashboardProps) => {
  const { toast } = useToast();

  const getSalesByCategory = (category: string) => {
    return sales.filter((sale) => sale.category === category);
  };

  const calculateTotalEarnings = (categorySales: Sale[]) => {
    return categorySales.reduce((total, sale) => total + sale.earned, 0);
  };

  const calculateTotalSales = () => {
    return sales.reduce((total, sale) => total + sale.earned, 0);
  };

  const handleDownloadSales = (category: string, categorySales: Sale[]) => {
    const totalEarnings = calculateTotalEarnings(categorySales);
    const content = `Sales Report for ${category.toUpperCase()}\n` +
      `Generated on: ${new Date().toLocaleString()}\n\n` +
      categorySales.map(sale => 
        `Item: ${sale.item_name}\n` +
        `Quantity: ${sale.quantity_reduced}\n` +
        `Earned: ₱${sale.earned}\n` +
        `Date: ${new Date(sale.timestamp).toLocaleString()}\n` +
        `----------------------------------------`
      ).join('\n\n') +
      `\n\nTotal Earnings: ₱${totalEarnings}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_report_${category}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `Sales report for ${category} has been downloaded`,
    });
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" /> 
          <span>Sales Summary</span>
          <div className="ml-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Total: ₱{calculateTotalSales().toFixed(2)}
          </div>
        </CardTitle>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const currentCategory = document.querySelector('[data-state="active"][role="tab"]')?.textContent?.toLowerCase() || 'chicken';
              const categorySales = getSalesByCategory(currentCategory);
              handleDownloadSales(currentCategory, categorySales);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const currentCategory = document.querySelector('[data-state="active"][role="tab"]')?.textContent?.toLowerCase() || 'chicken';
              handleResetCategory(currentCategory);
            }}
          >
            Reset Sales
          </Button>
        </div>
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
                  {categorySales.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-4 mb-4">
                      <p className="font-semibold flex items-center text-lg">
                        Total {category} earnings: <PhilippinePeso className="h-4 w-4 mx-1" />
                        {totalEarnings.toFixed(2)}
                      </p>
                    </div>
                  )}
                  
                  {categorySales.map((sale) => (
                    <div key={sale.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{sale.item_name}</h3>
                          <p>Quantity reduced: {sale.quantity_reduced}</p>
                          <p className="flex items-center">
                            Earned: <PhilippinePeso className="h-3 w-3 mx-1" />{sale.earned}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(sale.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSaleDelete(sale.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {categorySales.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No sales recorded for {category}</p>
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
