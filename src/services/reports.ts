
import { supabase } from "@/integrations/supabase/client";

export interface SalesData {
  name: string;
  sales: number;
  orders: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface CustomerData {
  name: string;
  new: number;
  returning: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export interface StatOverview {
  title: string;
  value: string;
  trend: string;
  description: string;
  icon: React.ReactNode;
  positive: boolean;
}

export const fetchSalesData = async (): Promise<SalesData[]> => {
  try {
    // In a real application, we would fetch this from Supabase
    // For now, we'll return mock data
    return [
      { name: "Jan", sales: 4000, orders: 240 },
      { name: "Feb", sales: 3000, orders: 198 },
      { name: "Mar", sales: 5000, orders: 280 },
      { name: "Apr", sales: 2780, orders: 190 },
      { name: "May", sales: 1890, orders: 150 },
      { name: "Jun", sales: 6390, orders: 310 },
      { name: "Jul", sales: 3490, orders: 220 },
    ];
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};

export const fetchCategoryData = async (): Promise<CategoryData[]> => {
  try {
    // This would fetch from Supabase in a real application
    // For now, we'll return mock data
    return [
      { name: "Footwear", value: 45 },
      { name: "Apparel", value: 30 },
      { name: "Electronics", value: 15 },
      { name: "Accessories", value: 10 },
    ];
  } catch (error) {
    console.error("Error fetching category data:", error);
    throw error;
  }
};

export const fetchCustomerData = async (): Promise<CustomerData[]> => {
  try {
    // This would fetch from Supabase in a real application
    // For now, we'll return mock data
    return [
      { name: "Jan", new: 500, returning: 300 },
      { name: "Feb", new: 450, returning: 290 },
      { name: "Mar", new: 600, returning: 400 },
      { name: "Apr", new: 550, returning: 380 },
      { name: "May", new: 700, returning: 480 },
      { name: "Jun", new: 650, returning: 520 },
      { name: "Jul", new: 800, returning: 600 },
    ];
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};

export const fetchTopProducts = async (): Promise<TopProduct[]> => {
  try {
    // This would fetch from Supabase in a real application
    // For now, we'll return mock data
    return [
      { name: "Nike Air Max 270", sales: 234, revenue: 34999.66 },
      { name: "Adidas Ultraboost 22", sales: 187, revenue: 29999.73 },
      { name: "Apple iPhone 14 Pro", sales: 156, revenue: 155844.44 },
      { name: "Levi's 501 Original Fit Jeans", sales: 132, revenue: 11879.68 },
      { name: "Samsung Galaxy S23", sales: 120, revenue: 107999.8 },
    ];
  } catch (error) {
    console.error("Error fetching top products:", error);
    throw error;
  }
};

export const exportReportData = (data: any[], filename: string, format: 'csv' | 'json') => {
  let content: string;
  let mimeType: string;
  
  if (format === 'csv') {
    // Convert to CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    content = [headers, ...rows].join('\n');
    mimeType = 'text/csv';
    filename = `${filename}.csv`;
  } else {
    // Convert to JSON
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
    filename = `${filename}.json`;
  }
  
  // Create download link
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
