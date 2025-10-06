
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Tag,
  Percent,
  Settings,
  Menu,
  X,
  LogOut,
  PieChart,
  PackageOpen,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, path, isActive, onClick }: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start py-6 px-4 mb-1 text-base font-medium rounded-xl transition-all",
        isActive
          ? "bg-shopink-50 text-shopink-800 hover:bg-shopink-100 dark:bg-shopink-500/20 dark:text-shopink-300 dark:hover:bg-shopink-500/30"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      )}
      onClick={onClick}
    >
      <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-shopink-500" : "")} />
      {label}
    </Button>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const sidebarItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      path: "/orders",
    },
    {
      icon: Package,
      label: "Products",
      path: "/products",
    },
    {
      icon: Users,
      label: "Customers",
      path: "/customers",
    },
    {
      icon: CreditCard,
      label: "Payments",
      path: "/payments",
    },
    {
      icon: Percent,
      label: "Discounts",
      path: "/discounts",
    },
    {
      icon: PackageOpen,
      label: "Inventory",
      path: "/inventory",
    },
    {
      icon: PieChart,
      label: "Reports",
      path: "/reports",
    },
    {
      icon: BellRing,
      label: "Marketing",
      path: "/marketing",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar Backdrop for Mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-all animate-fade-in"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 z-50 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          isMobile ? "animate-slide-in" : ""
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-shopink-500 flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Shopink</h1>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="py-6 px-3 overflow-y-auto h-[calc(100%-64px-64px)]">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
              onClick={() => navigateTo(item.path)}
            />
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 p-4">
          {user && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-600 hover:text-red-500 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log Out
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
