import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sale } from "@/types/inventory";

interface EarningsDashboardProps {
  sales: Sale[];
}

const EarningsDashboard = ({ sales }: EarningsDashboardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <h3 className="font-semibold">{sale.itemName}</h3>
              <p>Quantity reduced: {sale.quantityReduced}</p>
              <p>Earned: ${sale.earned}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(sale.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsDashboard;