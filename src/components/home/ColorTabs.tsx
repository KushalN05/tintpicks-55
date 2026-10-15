
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeaturedColors from "@/components/FeaturedColors";
import ColorGrid from "@/components/ColorGrid";
import ColorSwiper from "@/components/ColorSwiper";
import { SavedColor } from "@/hooks/useHomePage";

interface ColorTabsProps {
  activeTab: string;
  setActiveTab: (v: string) => void;
  savedColors: SavedColor[];
  onShop: (color: string) => void;
  onColorAdd: (color: string) => void;
  onShowYay: () => void;
  onColorSaveFromDiscover: (color: { hex: string }) => void;
}

const ColorTabs: React.FC<ColorTabsProps> = ({
  activeTab,
  setActiveTab,
  savedColors,
  onShop,
  onColorAdd,
  onShowYay,
  onColorSaveFromDiscover
}) => (
  <Tabs defaultValue="explore" className="w-full" value={activeTab} onValueChange={setActiveTab}>
    <TabsList className="w-full justify-center mb-6">
      <TabsTrigger value="explore">Explore Colors</TabsTrigger>
      <TabsTrigger value="discover">Discover Colors</TabsTrigger>
    </TabsList>
    <TabsContent value="explore">
      <FeaturedColors onSelect={onColorAdd} />
      <div id="tour-harmonies">
        <ColorGrid colors={savedColors} onShop={onShop} />
      </div>
    </TabsContent>
    <TabsContent value="discover">
      <ColorSwiper
        onFirstColorSave={onShowYay}
        onColorSave={onColorSaveFromDiscover}
      />
    </TabsContent>
  </Tabs>
);

export default ColorTabs;
