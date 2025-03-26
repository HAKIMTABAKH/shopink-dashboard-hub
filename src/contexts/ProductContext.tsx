
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
  image: string;
  status: ProductStatus;
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getLowStockProducts: () => Product[];
  getOutOfStockProducts: () => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Convert database products to our Product type
        const formattedProducts: Product[] = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          description: item.description || '',
          price: Number(item.price),
          stock: item.stock,
          image: item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
          status: item.status as ProductStatus,
        }));

        setProducts(formattedProducts);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again later.');
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const determineStatus = (stock: number): ProductStatus => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      // Calculate status based on stock level
      const status = determineStatus(product.stock);

      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image: product.image,
          status: status,
        }])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Convert database product to our Product type
        const newProduct: Product = {
          id: data[0].id,
          name: data[0].name,
          category: data[0].category,
          description: data[0].description || '',
          price: Number(data[0].price),
          stock: data[0].stock,
          image: data[0].image,
          status: data[0].status as ProductStatus,
        };

        setProducts([newProduct, ...products]);
        toast.success(`${product.name} has been added to your inventory.`);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Failed to add product');
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      // Calculate status based on stock level
      const status = determineStatus(updatedProduct.stock);

      const { error } = await supabase
        .from('products')
        .update({ 
          name: updatedProduct.name,
          category: updatedProduct.category,
          description: updatedProduct.description,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          image: updatedProduct.image,
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedProduct.id);

      if (error) {
        throw error;
      }

      // Update local state
      setProducts(products.map(product => 
        product.id === updatedProduct.id ? {...updatedProduct, status} : product
      ));
      
      toast.success(`${updatedProduct.name} has been updated.`);
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      const productToDelete = products.find(product => product.id === id);
      setProducts(products.filter(product => product.id !== id));
      
      if (productToDelete) {
        toast.success(`${productToDelete.name} has been deleted.`);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.status === "Low Stock");
  };

  const getOutOfStockProducts = () => {
    return products.filter(product => product.status === "Out of Stock");
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      isLoading,
      error,
      addProduct, 
      updateProduct, 
      deleteProduct,
      getLowStockProducts,
      getOutOfStockProducts,
      refreshProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};
