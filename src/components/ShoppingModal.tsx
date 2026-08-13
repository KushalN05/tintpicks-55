
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getColorName } from '../utils/colorMapping';
import { getColorAnalysis } from '../utils/colors/colorUtils';

// Expanded clothingTypes with more options
const clothingTypes = [
  { value: "shirts", label: "Shirts" },
  { value: "t-shirts", label: "T-Shirts" },
  { value: "jackets", label: "Jackets" },
  { value: "sweaters", label: "Sweaters" },
  { value: "pants", label: "Pants" },
  { value: "jeans", label: "Jeans" },
  { value: "shorts", label: "Shorts" },
  { value: "leggings", label: "Leggings" },
  { value: "joggers", label: "Joggers" },
  { value: "dresses", label: "Dresses" },
  { value: "skirts", label: "Skirts" },
  { value: "outerwear", label: "Outerwear" },
  { value: "coats", label: "Coats" },
  { value: "suits", label: "Suits" },
  { value: "blazers", label: "Blazers" },
  { value: "socks", label: "Socks" },
  { value: "underwear", label: "Underwear" },
  { value: "shoes", label: "Shoes" },
  { value: "boots", label: "Boots" },
  { value: "sandals", label: "Sandals" },
  { value: "sneakers", label: "Sneakers" },
  { value: "bags", label: "Bags" },
  { value: "hats", label: "Hats" },
  { value: "scarves", label: "Scarves" },
  { value: "gloves", label: "Gloves" },
  { value: "belts", label: "Belts" },
  { value: "ties", label: "Ties" },
  { value: "accessories", label: "Accessories" },
];

const ShoppingModal = ({
  isOpen,
  onClose,
  color,
}: {
  isOpen: boolean;
  onClose: () => void;
  color: string;
}) => {
  const [gender, setGender] = useState('men');
  const [type, setType] = useState('shirts');
  const colorName = getColorName(color);
  const { analysis } = getColorAnalysis(color);

  const handleShop = () => {
    const searchQuery = `${gender}+${type}+${colorName}+color`;
    window.open(`https://www.google.com/search?tbm=shop&q=${searchQuery}`, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-ghibli-beige/95 backdrop-blur-sm border-ghibli-blue/30 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-ghibli-forest font-ghibli text-xl">Shop This Color</DialogTitle>
          <DialogDescription>
            Search for clothing items in this color
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 p-3 ghibli-card">
            <div
              className="w-16 h-16 rounded-lg"
              style={{ backgroundColor: color }}
            />
            <div>
              <p className="font-medium text-ghibli-forest">{colorName}</p>
              <p className="text-sm text-ghibli-forest/70">{color}</p>
              <p className="text-xs text-ghibli-forest/70 mt-1">{analysis}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 ghibli-card">
              <label className="text-sm font-medium mb-3 block text-ghibli-forest">Gender:</label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="men" id="men" className="text-ghibli-blue" />
                  <label htmlFor="men" className="text-ghibli-forest">Men</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="women" id="women" className="text-ghibli-blue" />
                  <label htmlFor="women" className="text-ghibli-forest">Women</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kids" id="kids" className="text-ghibli-blue" />
                  <label htmlFor="kids" className="text-ghibli-forest">Kids</label>
                </div>
              </RadioGroup>
            </div>

            <div className="p-3 ghibli-card">
              <label className="text-sm font-medium mb-3 block text-ghibli-forest">Type:</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full bg-white border border-ghibli-blue focus:ring-ghibli-blue focus:border-ghibli-blue focus:outline-none text-ghibli-forest font-medium rounded">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  {clothingTypes.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-ghibli-forest cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleShop} className="w-full bg-ghibli-blue hover:bg-ghibli-blue/90 text-white rounded-full">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Search on Google Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingModal;

