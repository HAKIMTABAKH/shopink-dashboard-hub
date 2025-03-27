
import { supabase } from "@/integrations/supabase/client";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  stockStatus: string;
  reorderLevel: number;
  supplier: string;
  lastRestocked: string;
}

export const updateProductStock = async (productId: string, addedQuantity: number) => {
  try {
    // First, get the current stock
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock, status")
      .eq("id", productId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Calculate new stock
    const newStock = product.stock + addedQuantity;
    
    // Calculate new status based on stock level
    let newStatus = "In Stock";
    if (newStock <= 0) {
      newStatus = "Out of Stock";
    } else if (newStock <= 10) {
      newStatus = "Low Stock";
    }
    
    // Update the product
    const { error: updateError } = await supabase
      .from("products")
      .update({ 
        stock: newStock, 
        status: newStatus,
        updated_at: new Date()
      })
      .eq("id", productId);
      
    if (updateError) throw updateError;
    
    return { newStock, newStatus };
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
};

export const getSupplierByCategory = (category: string): string => {
  switch (category) {
    case "Footwear":
      return "Nike, Inc.";
    case "Apparel":
      return "H&M Group";
    case "Electronics":
      return "Apple Inc.";
    default:
      return "Generic Supplier";
  }
};

export const formatInventoryItems = (products: any[]): InventoryItem[] => {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    sku: `SKU-${product.id.substring(0, 8)}`,
    category: product.category,
    stock: product.stock,
    stockStatus: product.status,
    reorderLevel: 10, // Default reorder level
    supplier: getSupplierByCategory(product.category),
    lastRestocked: product.updated_at ? new Date(product.updated_at).toLocaleDateString() : "Not restocked",
  }));
};
