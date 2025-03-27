
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  total_orders: number;
  total_spent: number;
  joinDate: string; // Formatted date for display
}

interface CustomerContextType {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  addCustomer: (customer: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'joinDate'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  sendEmailToCustomer: (email: string, subject: string, message: string) => Promise<void>;
  refreshCustomers: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Format customer data for display
        const formattedCustomers: Customer[] = data.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone || undefined,
          address: item.address || undefined,
          total_orders: item.total_orders || 0,
          total_spent: item.total_spent || 0,
          joinDate: new Date(item.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        }));

        setCustomers(formattedCustomers);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to fetch customers. Please try again later.');
      toast.error('Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const refreshCustomers = async () => {
    await fetchCustomers();
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'joinDate'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{ 
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          total_orders: 0,
          total_spent: 0
        }])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const newCustomer: Customer = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          phone: data[0].phone || undefined,
          address: data[0].address || undefined,
          total_orders: data[0].total_orders || 0,
          total_spent: data[0].total_spent || 0,
          joinDate: new Date(data[0].created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        };

        setCustomers([newCustomer, ...customers]);
        toast.success(`${customer.name} has been added to your customers.`);
      }
    } catch (err) {
      console.error('Error adding customer:', err);
      toast.error('Failed to add customer');
    }
  };

  const updateCustomer = async (updatedCustomer: Customer) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ 
          name: updatedCustomer.name,
          email: updatedCustomer.email,
          phone: updatedCustomer.phone,
          address: updatedCustomer.address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedCustomer.id);

      if (error) {
        throw error;
      }

      // Update local state
      setCustomers(customers.map(customer => 
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      ));
      
      toast.success(`${updatedCustomer.name} has been updated.`);
    } catch (err) {
      console.error('Error updating customer:', err);
      toast.error('Failed to update customer');
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      const customerToDelete = customers.find(customer => customer.id === id);
      setCustomers(customers.filter(customer => customer.id !== id));
      
      if (customerToDelete) {
        toast.success(`${customerToDelete.name} has been deleted.`);
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast.error('Failed to delete customer');
    }
  };

  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  const sendEmailToCustomer = async (email: string, subject: string, message: string) => {
    try {
      // Simulating email sending functionality
      // In a real app, this would call an edge function or email service
      console.log(`Sending email to ${email} with subject: ${subject}`);
      console.log(`Message: ${message}`);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Email sent to ${email} successfully!`);
      return Promise.resolve();
    } catch (err) {
      console.error('Error sending email:', err);
      toast.error('Failed to send email');
      return Promise.reject(err);
    }
  };

  return (
    <CustomerContext.Provider value={{ 
      customers, 
      isLoading,
      error,
      addCustomer, 
      updateCustomer, 
      deleteCustomer,
      getCustomerById,
      sendEmailToCustomer,
      refreshCustomers
    }}>
      {children}
    </CustomerContext.Provider>
  );
};
