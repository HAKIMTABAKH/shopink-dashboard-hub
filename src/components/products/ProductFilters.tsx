
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

const ProductFilters = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [openCategories, setOpenCategories] = useState(true);
  const [openBrands, setOpenBrands] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Categories */}
        <Collapsible open={openCategories} onOpenChange={setOpenCategories}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between py-2 cursor-pointer">
              <h3 className="font-medium">Categories</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${openCategories ? "transform rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="footwear" />
              <Label htmlFor="footwear">Footwear</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="apparel" />
              <Label htmlFor="apparel">Apparel</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="electronics" />
              <Label htmlFor="electronics">Electronics</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="accessories" />
              <Label htmlFor="accessories">Accessories</Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Brands */}
        <Collapsible open={openBrands} onOpenChange={setOpenBrands}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between py-2 cursor-pointer">
              <h3 className="font-medium">Brands</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${openBrands ? "transform rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="nike" />
              <Label htmlFor="nike">Nike</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="adidas" />
              <Label htmlFor="adidas">Adidas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="puma" />
              <Label htmlFor="puma">Puma</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="levis" />
              <Label htmlFor="levis">Levi's</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="apple" />
              <Label htmlFor="apple">Apple</Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Price Range */}
        <Collapsible open={openPrice} onOpenChange={setOpenPrice}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between py-2 cursor-pointer">
              <h3 className="font-medium">Price Range</h3>
              <ChevronDown className={`h-4 w-4 transition-transform ${openPrice ? "transform rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-4">
              <Slider 
                defaultValue={[0, 1000]} 
                max={1000} 
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <Button className="w-full mt-4 bg-shopink-500 hover:bg-shopink-600">Apply Filters</Button>
        <Button variant="outline" className="w-full">Clear Filters</Button>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
