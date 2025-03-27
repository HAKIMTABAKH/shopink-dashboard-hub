
import { useState, useEffect } from "react";
import { Save, Store, User, Bell, CreditCard, Shield, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  getStoreSettings, 
  getUserSettings, 
  saveStoreSettings, 
  saveUserSettings,
  StoreSettings,
  UserSettings
} from "@/services/settings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Store settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    currency: "USD",
    language: "en",
    timeZone: "America/New_York",
    taxRate: 0
  });
  
  // User settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "",
    email: "",
    role: "",
    notificationsEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
    theme: "system"
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const [store, user] = await Promise.all([
          getStoreSettings(),
          getUserSettings()
        ]);
        
        setStoreSettings(store);
        setUserSettings(user);
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast]);
  
  const handleStoreSettingChange = (field: keyof StoreSettings, value: any) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleUserSettingChange = (field: keyof UserSettings, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveStoreSettings = async () => {
    setIsSaving(true);
    try {
      await saveStoreSettings(storeSettings);
      
      toast({
        title: "Settings Saved",
        description: "Your store settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving store settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveUserSettings = async () => {
    setIsSaving(true);
    try {
      await saveUserSettings(userSettings);
      
      toast({
        title: "Settings Saved",
        description: "Your user settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving user settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your store and account settings</p>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="mb-4">
          <TabsTrigger value="general">
            <Store className="h-4 w-4 mr-2" />
            Store
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="help">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and public information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={storeSettings.name}
                    onChange={(e) => handleStoreSettingChange("name", e.target.value)}
                    placeholder="Your Store Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-email">Contact Email</Label>
                  <Input
                    id="store-email"
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => handleStoreSettingChange("email", e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Phone Number</Label>
                  <Input
                    id="store-phone"
                    value={storeSettings.phone}
                    onChange={(e) => handleStoreSettingChange("phone", e.target.value)}
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-logo">Store Logo URL</Label>
                  <Input
                    id="store-logo"
                    value={storeSettings.logo}
                    onChange={(e) => handleStoreSettingChange("logo", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="store-address">Address</Label>
                  <Textarea
                    id="store-address"
                    value={storeSettings.address}
                    onChange={(e) => handleStoreSettingChange("address", e.target.value)}
                    placeholder="123 Street Name, City, State, ZIP"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-shopink-500 hover:bg-shopink-600"
                onClick={handleSaveStoreSettings}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Configure currency, language, and tax settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) => handleStoreSettingChange("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={storeSettings.language}
                    onValueChange={(value) => handleStoreSettingChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select
                    value={storeSettings.timeZone}
                    onValueChange={(value) => handleStoreSettingChange("timeZone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={storeSettings.taxRate}
                    onChange={(e) => handleStoreSettingChange("taxRate", parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-shopink-500 hover:bg-shopink-600"
                onClick={handleSaveStoreSettings}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input
                    id="user-name"
                    value={userSettings.name}
                    onChange={(e) => handleUserSettingChange("name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email Address</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => handleUserSettingChange("email", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Input
                    id="user-role"
                    value={userSettings.role}
                    disabled
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <RadioGroup
                  value={userSettings.theme}
                  onValueChange={(value: "light" | "dark" | "system") => handleUserSettingChange("theme", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="cursor-pointer">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="cursor-pointer">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system" className="cursor-pointer">System Default</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-shopink-500 hover:bg-shopink-600"
                onClick={handleSaveUserSettings}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable Notifications</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications about orders, customers, and products
                  </p>
                </div>
                <Switch
                  checked={userSettings.notificationsEnabled}
                  onCheckedChange={(checked) => handleUserSettingChange("notificationsEnabled", checked)}
                />
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Notification Channels</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Email Notifications</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={userSettings.emailNotifications}
                      onCheckedChange={(checked) => handleUserSettingChange("emailNotifications", checked)}
                      disabled={!userSettings.notificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Push Notifications</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={userSettings.pushNotifications}
                      onCheckedChange={(checked) => handleUserSettingChange("pushNotifications", checked)}
                      disabled={!userSettings.notificationsEnabled}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-shopink-500 hover:bg-shopink-600"
                onClick={handleSaveUserSettings}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your store's payment methods and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">P</div>
                    <div>
                      <h4 className="font-medium">PayPal</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Accept payments via PayPal
                      </p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">S</div>
                    <div>
                      <h4 className="font-medium">Stripe</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Accept credit card payments via Stripe
                      </p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold mr-4">COD</div>
                    <div>
                      <h4 className="font-medium">Cash on Delivery</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow customers to pay when they receive their order
                      </p>
                    </div>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-shopink-500 hover:bg-shopink-600"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="bg-shopink-500 hover:bg-shopink-600">
                    Update Password
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Session Management</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Log out from all other devices
                    </p>
                  </div>
                  <Button variant="destructive">Sign Out Everywhere</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>
                Find answers to common questions and get support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="mr-4">
                    <HelpCircle className="h-8 w-8 text-shopink-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Documentation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Comprehensive guides on how to use all features
                    </p>
                    <Button variant="ghost" className="p-0 h-auto text-shopink-500 hover:text-shopink-600">
                      View Documentation
                    </Button>
                  </div>
                </div>
                
                <div className="flex p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="mr-4">
                    <Mail className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Contact Support</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Get in touch with our support team for assistance
                    </p>
                    <Button variant="ghost" className="p-0 h-auto text-blue-500 hover:text-blue-600">
                      Email Support
                    </Button>
                  </div>
                </div>
                
                <div className="flex p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="mr-4">
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Community Forum</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Connect with other users and share knowledge
                    </p>
                    <Button variant="ghost" className="p-0 h-auto text-green-500 hover:text-green-600">
                      Visit Forum
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
