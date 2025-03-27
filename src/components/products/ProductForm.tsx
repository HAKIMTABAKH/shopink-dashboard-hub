
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Define Product type to fix the error
interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  status?: string;
}

const ProductForm = ({ product }: { product?: Product }) => {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [category, setCategory] = useState(product?.category || "");
  const [stock, setStock] = useState(product?.stock?.toString() || "");
  const [image, setImage] = useState(product?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate status based on stock level
      const stockNum = parseInt(stock);
      let status = "In Stock";
      if (stockNum <= 0) {
        status = "Out of Stock";
      } else if (stockNum <= 10) {
        status = "Low Stock";
      }

      const productData = {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: stockNum,
        image,
        status,
        updated_at: new Date().toISOString(), // Convert Date to string
      };

      let result;
      if (product?.id) {
        // Update existing product
        result = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);
      } else {
        // Create new product
        result = await supabase
          .from("products")
          .insert([{ 
            ...productData, 
            created_at: new Date().toISOString()  // Convert Date to string
          }]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: product?.id ? "Product Updated" : "Product Created",
        description: `Successfully ${product?.id ? "updated" : "created"} ${name}`,
      });

      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: `Failed to ${product?.id ? "update" : "create"} product. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Footwear">Footwear</SelectItem>
                <SelectItem value="Apparel">Apparel</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32"
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          type="button"
          onClick={() => navigate("/products")}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-shopink-500 hover:bg-shopink-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : (product?.id ? "Update Product" : "Create Product")}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
