
import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatInventoryItems, updateProductStock, InventoryItem } from "@/services/inventory";

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(0);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchInventory();
  }, []);
  
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("*");
        
      if (error) throw error;
      
      const formattedItems = formatInventoryItems(products);
      setInventoryItems(formattedItems);
      
      // Calculate inventory statistics
      setStats({
        totalProducts: products.length,
        lowStockItems: products.filter(p => p.status === "Low Stock").length,
        outOfStockItems: products.filter(p => p.status === "Out of Stock").length,
      });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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

  const handleRestock = async () => {
    if (!selectedProductId || restockQuantity <= 0) return;
    
    try {
      const { newStock, newStatus } = await updateProductStock(selectedProductId, restockQuantity);
      
      toast({
        title: "Inventory Updated",
        description: `Added ${restockQuantity} units. New stock: ${newStock} units.`,
      });
      
      // Refresh inventory data
      fetchInventory();
      
      // Reset form
      setIsRestockDialogOpen(false);
      setRestockQuantity(0);
      setSelectedProductId(null);
    } catch (error) {
      console.error("Error restocking:", error);
      toast({
        title: "Error",
        description: "Failed to update inventory. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter and sort inventory items
  let filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    
    const matchesStock = 
      stockFilter === "all" || 
      item.stockStatus.toLowerCase().replace(/\s+/g, "-") === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock;
  });
  
  // Sort inventory items
  filteredItems = filteredItems.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "stock") {
      return b.stock - a.stock;
    } else if (sortBy === "low-stock") {
      return a.stock - b.stock;
    }
    return 0;
  });

  // Inventory statistics
  const inventoryStats = [
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      icon: <ArrowDownUp className="h-6 w-6 text-shopink-500" />,
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems.toString(),
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockItems.toString(),
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
    },
  ];
  
  const handleExport = () => {
    // Generate CSV content
    const headers = ["Product", "SKU", "Category", "Stock", "Status", "Supplier"];
    const csvContent = [
      headers.join(","),
      ...filteredItems.map(item => 
        [
          item.name,
          item.sku,
          item.category,
          item.stock,
          item.stockStatus,
          item.supplier
        ].join(",")
      )
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Inventory data has been exported to CSV.",
    });
  };

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
          
          <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-shopink-500 hover:bg-shopink-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                Update Stock
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Button variant="outline" onClick={handleExport}>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">Loading inventory data...</TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">No inventory items found matching your filters.</TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="w-36">
                      {getStockProgress(item.stock, item.reorderLevel)}
                    </div>
                  </TableCell>
                  <TableCell>{getStockStatusBadge(item.stockStatus)}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.lastRestocked}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      className={
                        item.stockStatus === "Out of Stock" || item.stockStatus === "Low Stock"
                          ? "bg-shopink-500 hover:bg-shopink-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }
                      onClick={() => {
                        setSelectedProductId(item.id);
                        setIsRestockDialogOpen(true);
                      }}
                    >
                      Restock
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="restock-quantity" className="text-sm font-medium">
                Quantity to Add
              </label>
              <Input
                id="restock-quantity"
                type="number"
                min="1"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
                placeholder="Enter quantity"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-shopink-500 hover:bg-shopink-600"
              onClick={handleRestock}
            >
              Update Stock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
