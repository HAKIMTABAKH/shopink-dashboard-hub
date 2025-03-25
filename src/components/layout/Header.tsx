
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

const pathToTitle: Record<string, string> = {
  "/": "Dashboard",
  "/orders": "Order Management",
  "/products": "Product Management",
  "/customers": "Customer Management",
  "/payments": "Payment & Transactions",
  "/discounts": "Discount & Coupon Management",
  "/inventory": "Inventory & Stock Management",
  "/reports": "Reports & Analytics",
  "/marketing": "Marketing & Notifications",
  "/settings": "Settings",
};

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const pageTitle = pathToTitle[location.pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container py-4 flex items-center justify-between">
        {/* Left: Page Title */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
        </div>

        {/* Right: Search, Theme Toggle, Notifications, Avatar */}
        <div className="flex items-center space-x-3">
          {!isMobile && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5 text-shopink-500" />
            )}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order #12345 - $320.11</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">5 minutes ago</p>
                </div>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <p className="text-sm font-medium">Low stock alert</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Nike Blazer Mid '77 - 3 items left</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                </div>
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <p className="text-sm font-medium">Payment processed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Payment for order #12342 successful</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday</p>
                </div>
              </div>
              <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                <Button variant="ghost" className="w-full text-sm">View all notifications</Button>
              </div>
            </PopoverContent>
          </Popover>

          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-shopink-100 text-shopink-800">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
