
import { supabase } from "@/integrations/supabase/client";

export interface StoreSettings {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  currency: string;
  language: string;
  timeZone: string;
  taxRate: number;
}

export interface UserSettings {
  id?: string;
  name: string;
  email: string;
  role: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: "light" | "dark" | "system";
}

export const saveStoreSettings = async (settings: StoreSettings): Promise<StoreSettings> => {
  try {
    // For now, we'll just simulate an API call
    // In a real app, this would update a settings table in Supabase
    
    return {
      id: "1",
      ...settings
    };
  } catch (error) {
    console.error("Error saving store settings:", error);
    throw error;
  }
};

export const saveUserSettings = async (settings: UserSettings): Promise<UserSettings> => {
  try {
    // For now, we'll just simulate an API call
    // In a real app, this would update a users table in Supabase
    
    return {
      id: "1",
      ...settings
    };
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
};

export const getStoreSettings = async (): Promise<StoreSettings> => {
  // This would normally fetch from the database
  // For now we'll return mock data
  return {
    id: "1",
    name: "Shopink Store",
    email: "contact@shopink.com",
    phone: "+1 (555) 123-4567",
    address: "123 Commerce St, Shopping City, SC 12345",
    logo: "",
    currency: "USD",
    language: "en",
    timeZone: "America/New_York",
    taxRate: 8.5
  };
};

export const getUserSettings = async (): Promise<UserSettings> => {
  // This would normally fetch from the database
  // For now we'll return mock data
  return {
    id: "1",
    name: "Admin User",
    email: "admin@shopink.com",
    role: "Administrator",
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
    theme: "system"
  };
};
