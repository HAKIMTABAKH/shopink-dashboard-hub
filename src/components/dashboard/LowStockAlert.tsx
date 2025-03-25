
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShoppingBag } from "lucide-react";

interface StockItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  threshold: number;
}

const items: StockItem[] = [
  {
    id: 1,
    name: "Nike Blazer Mid '77",
    category: "Footwear",
    stock: 3,
    threshold: 5,
  },
  {
    id: 2,
    name: "Air Jordan 7 Retro SE",
    category: "Footwear",
    stock: 2,
    threshold: 5,
  },
  {
    id: 3,
    name: "Adidas Originals Hoodie",
    category: "Apparel",
    stock: 4,
    threshold: 10,
  },
  {
    id: 4,
    name: "Puma RS-X Sneakers",
    category: "Footwear",
    stock: 5,
    threshold: 10,
  },
];

const LowStockAlert = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <CardTitle className="text-lg font-bold">Low Stock Alerts</CardTitle>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
            {items.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map((item) => (
            <div key={item.id} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div className="p-2 bg-amber-50 text-amber-500 rounded-lg dark:bg-amber-900/20 dark:text-amber-400">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-red-500 font-medium ml-2">
                        Only {item.stock} left!
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    Restock
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 text-center border-t border-gray-100 dark:border-gray-800">
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View all inventory
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockAlert;
