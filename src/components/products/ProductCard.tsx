
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/80 dark:bg-black/60 h-8 w-8 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 dark:focus:text-red-400">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">{product.category}</span>
            <Badge 
              variant={
                product.status === "In Stock" 
                  ? "default" 
                  : product.status === "Low Stock" 
                    ? "outline" 
                    : "destructive"
              }
              className={
                product.status === "In Stock"
                  ? "bg-green-500"
                  : product.status === "Low Stock"
                    ? "border-amber-500 text-amber-500"
                    : ""
              }
            >
              {product.status}
            </Badge>
          </div>
          <h3 className="font-semibold text-xl truncate">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">Preview</Button>
        <Button 
          className="bg-shopink-500 hover:bg-shopink-600" 
          size="sm"
        >
          Edit Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
