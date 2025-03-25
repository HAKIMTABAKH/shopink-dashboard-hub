
import { useState } from "react";
import { Search, Filter, PlusCircle, AlertTriangle, ArrowDownUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const productsData = [
  {
    id: "P001",
    name: "Nike Air Max 270",
    sku: "NKE-AM270-BLK-42",
    category: "Footwear",
    stock: 28,
    stockStatus: "In Stock",
    reorderLevel: 10,
    supplier: "Nike, Inc.",
    lastRestocked: "Jun 05, 2023",
  },
  {
    id: "P002",
    name: "Adidas Ultraboost 22",
    sku: "ADS-UB22-WHT-41",
    category: "Footwear",
    stock: 15,
    stockStatus: "In Stock",
    reorderLevel: 12,
    supplier: "Adidas AG",
    lastRestocked: "Jun 02, 2023",
  },
  {
    id: "P003",
    name: "Puma RS-X Toys",
    sku: "PMA-RSX-RED-43",
    category: "Footwear",
    stock: 5,
    stockStatus: "Low Stock",
    reorderLevel: 8,
    supplier: "Puma SE",
    lastRestocked: "May 20, 2023",
  },
  {
    id: "P004",
    name: "Levi's 501 Original Fit Jeans",
    sku: "LVS-501-BLU-34",
    category: "Apparel",
    stock: 42,
    stockStatus: "In Stock",
    reorderLevel: 15,
    supplier: "Levi Strauss & Co.",
    lastRestocked: "Jun 10, 2023",
  },
  {
    id: "P005",
    name: "H&M Cotton T-shirt",
    sku: "HNM-CTN-BLK-M",
    category: "Apparel",
    stock: 68,
    stockStatus: "In Stock",
    reorderLevel: 20,
    supplier: "H&M Group",
    lastRestocked: "Jun 08, 2023",
  },
  {
    id: "P006",
    name: "Apple iPhone 14 Pro",
    sku: "APL-IP14P-GRY-256",
    category: "Electronics",
    stock: 0,
    stockStatus: "Out of Stock",
    reorderLevel: 5,
    supplier: "Apple Inc.",
    lastRestocked: "May 15, 2023",
  },
  {
    id: "P007",
    name: "Samsung Galaxy S23",
    sku: "SMS-GS23-BLK-128",
    category: "Electronics",
    stock: 3,
    stockStatus: "Low Stock",
    reorderLevel: 8,
    supplier: "Samsung Electronics",
    lastRestocked: "May 25, 2023",
  },
  {
    id: "P008",
    name: "Sony WH-1000XM5 Headphones",
    sku: "SNY-WH1000XM5-SLV",
    category: "Electronics",
    stock: 12,
    stockStatus: "In Stock",
    reorderLevel: 10,
    supplier: "Sony Corporation",
    lastRestocked: "Jun 01, 2023",
  },
];

// Inventory statistics
const inventoryStats = [
  {
    title: "Total Products",
    value: "1,245",
    icon: <ArrowDownUp className="h-6 w-6 text-shopink-500" />,
  },
  {
    title: "Low Stock Items",
    value: "24",
    icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
  },
  {
    title: "Out of Stock",
    value: "8",
    icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
  },
];

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  
  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-green-500">In Stock</Badge>;
      case "Low Stock":
        return <Badge className="bg-yellow-500 text-yellow-900">Low Stock</Badge>;
      case "Out of Stock":
        return <Badge className="bg-red-500">Out of Stock</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getStockProgress = (stock: number, reorderLevel: number) => {
    if (stock === 0) return 0;
    // Calculate a percentage that gives low stock (yellow) when approaching reorder level
    const ratio = stock / (reorderLevel * 2);
    const value = Math.min(ratio * 100, 100);
    
    let className = "bg-green-500";
    if (stock <= reorderLevel) {
      className = stock === 0 ? "bg-red-500" : "bg-yellow-500";
    }
    
    return (
      <div className="w-full">
        <Progress value={value} className={`h-2 ${className}`} />
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{stock} units</span>
          <span>Min: {reorderLevel}</span>
        </div>
      </div>
    );
  };

  // Filter and sort products
  let filteredProducts = productsData.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      product.category.toLowerCase() === categoryFilter.toLowerCase();
    
    const matchesStock = 
      stockFilter === "all" || 
      product.stockStatus.toLowerCase().replace(/\s+/g, "-") === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock;
  });
  
  // Sort products
  filteredProducts = filteredProducts.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "stock") {
      return b.stock - a.stock;
    } else if (sortBy === "low-stock") {
      return a.stock - b.stock;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {inventoryStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="footwear">Footwear</SelectItem>
              <SelectItem value="apparel">Apparel</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={stockFilter} 
            onValueChange={setStockFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={sortBy} 
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="stock">Stock (High-Low)</SelectItem>
              <SelectItem value="low-stock">Stock (Low-High)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-shopink-500 hover:bg-shopink-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            Update Stock
          </Button>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <div className="w-36">
                    {getStockProgress(product.stock, product.reorderLevel)}
                  </div>
                </TableCell>
                <TableCell>{getStockStatusBadge(product.stockStatus)}</TableCell>
                <TableCell>{product.supplier}</TableCell>
                <TableCell>{product.lastRestocked}</TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    className={
                      product.stockStatus === "Out of Stock" || product.stockStatus === "Low Stock"
                        ? "bg-shopink-500 hover:bg-shopink-600"
                        : "bg-gray-500 hover:bg-gray-600"
                    }
                  >
                    Restock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryPage;
