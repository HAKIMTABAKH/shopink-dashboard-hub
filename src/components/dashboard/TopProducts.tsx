
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  sales: number;
  revenue: number;
  lastSold: Date;
}

const products: Product[] = [
  {
    id: 1,
    name: "Nike Blazer Mid '77",
    image: "/placeholder.svg",
    category: "Footwear",
    sales: 128,
    revenue: 12800,
    lastSold: new Date(2023, 7, 14),
  },
  {
    id: 2,
    name: "Air Jordan 7 Retro SE",
    image: "/placeholder.svg",
    category: "Footwear",
    sales: 95,
    revenue: 11400,
    lastSold: new Date(2023, 7, 15),
  },
  {
    id: 3,
    name: "Nike Air Force 1 '07",
    image: "/placeholder.svg",
    category: "Footwear",
    sales: 87,
    revenue: 8700,
    lastSold: new Date(2023, 7, 16),
  },
  {
    id: 4,
    name: "Adidas Originals Hoodie",
    image: "/placeholder.svg",
    category: "Apparel",
    sales: 64,
    revenue: 3840,
    lastSold: new Date(2023, 7, 15),
  },
  {
    id: 5,
    name: "Puma RS-X Sneakers",
    image: "/placeholder.svg",
    category: "Footwear",
    sales: 52,
    revenue: 4160,
    lastSold: new Date(2023, 7, 17),
  },
];

const TopProducts = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {products.map((product) => (
            <div key={product.id} className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <Avatar className="h-10 w-10 rounded-md">
                <img src={product.image} alt={product.name} className="object-cover" />
              </Avatar>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                        {product.category}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        Last sold {formatDistanceToNow(product.lastSold, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {product.sales} sold
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
