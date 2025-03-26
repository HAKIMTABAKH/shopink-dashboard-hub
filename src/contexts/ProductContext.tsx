
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/components/products/ProductCard';

// Sample initial products data
const initialProducts: Product[] = [
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

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getLowStockProducts: () => Product[];
  getOutOfStockProducts: () => Product[];
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
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = (Math.max(...products.map(p => parseInt(p.id))) + 1).toString();
    setProducts([...products, { ...product, id: newId }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
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
      addProduct, 
      updateProduct, 
      deleteProduct,
      getLowStockProducts,
      getOutOfStockProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};
