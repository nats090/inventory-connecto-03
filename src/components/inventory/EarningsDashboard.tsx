import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sale } from "@/types/inventory";

interface EarningsDashboardProps {
  sales: Sale[];
}

const CATEGORIES = ["chicken", "pork", "beef", "fish"] as const;

const EarningsDashboard = ({ sales }: EarningsDashboardProps) => {
  const getSalesByCategory = (category: string) => {
    return sales.filter((sale) => sale.category === category);
  };

  const calculateTotalEarnings = (categorySales: Sale[]) => {
    return categorySales.reduce((total, sale) => total + sale.earned, 0);
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
                    <div className="pt-4 border-t">
                      <p className="font-semibold">Total Earnings: ${totalEarnings}</p>
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