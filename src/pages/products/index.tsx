
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const productsData = [
  {
    id: "1",
    name: "Nike Air Max 270",
    category: "Footwear",
    price: 149.99,
    stock: 28,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    status: "In Stock",
  },
  {
    id: "2",
    name: "Adidas Ultraboost 22",
    category: "Footwear",
    price: 189.99,
    stock: 15,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    status: "In Stock",
  },
  {
    id: "3",
    name: "Puma RS-X Toys",
    category: "Footwear",
    price: 119.99,
    stock: 5,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    status: "Low Stock",
  },
  {
    id: "4",
    name: "Levi's 501 Original Fit Jeans",
    category: "Apparel",
    price: 89.99,
    stock: 42,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    status: "In Stock",
  },
  {
    id: "5",
    name: "H&M Cotton T-shirt",
    category: "Apparel",
    price: 19.99,
    stock: 68,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    status: "In Stock",
  },
  {
    id: "6",
    name: "Apple iPhone 14 Pro",
    category: "Electronics",
    price: 999.99,
    stock: 0,
    image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c",
    status: "Out of Stock",
  },
];

const ProductsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleFilters = () => setShowFilters(!showFilters);
  
  const filteredProducts = productsData.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={toggleFilters}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <Button className="bg-shopink-500 hover:bg-shopink-600">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {showFilters && (
          <div className="lg:col-span-1">
            <ProductFilters />
          </div>
        )}
        
        <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="in-stock">In Stock</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="in-stock" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.filter(p => p.status === "In Stock").map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="low-stock" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.filter(p => p.status === "Low Stock").map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="out-of-stock" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.filter(p => p.status === "Out of Stock").map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
