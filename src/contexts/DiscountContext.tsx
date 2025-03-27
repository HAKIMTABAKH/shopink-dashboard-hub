
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type DiscountType = "Percentage" | "Fixed";
export type DiscountStatus = "Active" | "Scheduled" | "Expired";

export interface Discount {
  id: string;
  name: string;
  code: string;
  type: DiscountType;
  value: number;
  usage: number;
  maxUsage: number | null;
  startDate: string;
  endDate: string | null;
  status: DiscountStatus;
  minPurchase?: number;
}

interface DiscountContextType {
  discounts: Discount[];
  isLoading: boolean;
  error: string | null;
  addDiscount: (discount: Omit<Discount, 'id' | 'usage' | 'status'>) => Promise<void>;
  updateDiscount: (discount: Discount) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
  getDiscountById: (id: string) => Discount | undefined;
  refreshDiscounts: () => Promise<void>;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export const useDiscounts = () => {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('useDiscounts must be used within a DiscountProvider');
  }
  return context;
};

interface DiscountProviderProps {
  children: ReactNode;
}

export const DiscountProvider = ({ children }: DiscountProviderProps) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const determineStatus = (startDate: string, endDate: string | null): DiscountStatus => {
    const now = new Date();
    const start = new Date(startDate);
    
    if (start > now) return "Scheduled";
    if (endDate && new Date(endDate) < now) return "Expired";
    return "Active";
  };

  const fetchDiscounts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Format discount data for display
        const formattedDiscounts: Discount[] = data.map(item => {
          const startDate = new Date(item.starts_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          
          const endDate = item.expires_at 
            ? new Date(item.expires_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : null;
          
          return {
            id: item.id,
            name: item.description || `Discount ${item.code}`,
            code: item.code,
            type: item.discount_type as DiscountType,
            value: Number(item.discount_value),
            usage: item.usage_count || 0,
            maxUsage: item.usage_limit,
            startDate,
            endDate,
            status: determineStatus(item.starts_at, item.expires_at),
            minPurchase: item.min_purchase ? Number(item.min_purchase) : undefined
          };
        });

        setDiscounts(formattedDiscounts);
      }
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('Failed to fetch discounts. Please try again later.');
      toast.error('Failed to fetch discounts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const refreshDiscounts = async () => {
    await fetchDiscounts();
  };

  const addDiscount = async (discount: Omit<Discount, 'id' | 'usage' | 'status'>) => {
    try {
      const startsAt = discount.startDate ? new Date(discount.startDate).toISOString() : new Date().toISOString();
      const expiresAt = discount.endDate ? new Date(discount.endDate).toISOString() : null;
      
      const { data, error } = await supabase
        .from('discounts')
        .insert([{ 
          code: discount.code,
          description: discount.name,
          discount_type: discount.type,
          discount_value: discount.value,
          min_purchase: discount.minPurchase || 0,
          usage_limit: discount.maxUsage,
          usage_count: 0,
          starts_at: startsAt,
          expires_at: expiresAt,
          is_active: true
        }])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newDiscount: Discount = {
          id: data[0].id,
          name: data[0].description || `Discount ${data[0].code}`,
          code: data[0].code,
          type: data[0].discount_type as DiscountType,
          value: Number(data[0].discount_value),
          usage: 0,
          maxUsage: data[0].usage_limit,
          startDate: new Date(data[0].starts_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          endDate: data[0].expires_at 
            ? new Date(data[0].expires_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            : null,
          status: determineStatus(data[0].starts_at, data[0].expires_at),
          minPurchase: data[0].min_purchase ? Number(data[0].min_purchase) : undefined
        };

        setDiscounts([newDiscount, ...discounts]);
        toast.success(`Discount ${discount.code} has been created.`);
      }
    } catch (err) {
      console.error('Error adding discount:', err);
      toast.error('Failed to add discount');
    }
  };

  const updateDiscount = async (updatedDiscount: Discount) => {
    try {
      const startsAt = updatedDiscount.startDate ? new Date(updatedDiscount.startDate).toISOString() : new Date().toISOString();
      const expiresAt = updatedDiscount.endDate ? new Date(updatedDiscount.endDate).toISOString() : null;
      
      const { error } = await supabase
        .from('discounts')
        .update({ 
          code: updatedDiscount.code,
          description: updatedDiscount.name,
          discount_type: updatedDiscount.type,
          discount_value: updatedDiscount.value,
          min_purchase: updatedDiscount.minPurchase || 0,
          usage_limit: updatedDiscount.maxUsage,
          starts_at: startsAt,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedDiscount.id);

      if (error) {
        throw error;
      }

      // Update local state
      setDiscounts(discounts.map(discount => 
        discount.id === updatedDiscount.id ? updatedDiscount : discount
      ));
      
      toast.success(`Discount ${updatedDiscount.code} has been updated.`);
    } catch (err) {
      console.error('Error updating discount:', err);
      toast.error('Failed to update discount');
    }
  };

  const deleteDiscount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('discounts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      const discountToDelete = discounts.find(discount => discount.id === id);
      setDiscounts(discounts.filter(discount => discount.id !== id));
      
      if (discountToDelete) {
        toast.success(`Discount ${discountToDelete.code} has been deleted.`);
      }
    } catch (err) {
      console.error('Error deleting discount:', err);
      toast.error('Failed to delete discount');
    }
  };

  const getDiscountById = (id: string) => {
    return discounts.find(discount => discount.id === id);
  };

  return (
    <DiscountContext.Provider value={{ 
      discounts, 
      isLoading,
      error,
      addDiscount, 
      updateDiscount, 
      deleteDiscount,
      getDiscountById,
      refreshDiscounts
    }}>
      {children}
    </DiscountContext.Provider>
  );
};
