
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type MascotMood = "happy" | "neutral" | "excited";

export interface SavedColor {
  id: string;
  hex: string;
  name?: string;
}

export interface UseHomePageProps {
  showCamera: boolean;
  setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
  showShoppingModal: boolean;
  setShowShoppingModal: React.Dispatch<React.SetStateAction<boolean>>;
  isTourActive: boolean;
  setIsTourActive: React.Dispatch<React.SetStateAction<boolean>>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  savedColors: SavedColor[];
  setSavedColors: React.Dispatch<React.SetStateAction<SavedColor[]>>;
  mascotMood: MascotMood;
  setMascotMood: React.Dispatch<React.SetStateAction<MascotMood>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  showYay: boolean;
  isLoadingColors: boolean;
  handleShowYay: () => void;
  handleColorCapture: (color: string, name?: string) => Promise<void>;
  handleColorAdd: (color: string, name?: string) => Promise<void>;
  handleClearColors: () => Promise<void>;
  handleDeleteColor: (id: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleShop: (color: string, category?: string) => void;
  selectedShopCategory: string;
  setSelectedShopCategory: React.Dispatch<React.SetStateAction<string>>;
}

export function useHomePage(): UseHomePageProps {
  const [showCamera, setShowCamera] = React.useState(false);
  const [showShoppingModal, setShowShoppingModal] = React.useState(false);
  const [isTourActive, setIsTourActive] = React.useState(false);
  const [selectedShopCategory, setSelectedShopCategory] = React.useState("All");
  const [selectedColor, setSelectedColor] = React.useState("");
  const [savedColors, setSavedColors] = React.useState<SavedColor[]>([]);
  const [mascotMood, setMascotMood] = React.useState<MascotMood>("happy");
  const [activeTab, setActiveTab] = React.useState("explore");
  const [showYay, setShowYay] = React.useState(false);
  const [yayShown, setYayShown] = React.useState(false);
  const [isLoadingColors, setIsLoadingColors] = React.useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();

  // Ensure login
  React.useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [navigate, session]);

  // Handles showing Yay loader only 1 time per session
  const handleShowYay = React.useCallback(() => {
    if (!yayShown) {
      setShowYay(true);
      setYayShown(true);
      setTimeout(() => setShowYay(false), 1200);
    }
  }, [yayShown]);

  const handleColorCapture = async (color: string, name?: string) => {
    if (!session) return;

    const insertData: any = {
      user_id: session.user.id,
      hex_code: color,
    };
    
    // We try to insert 'name' if the database schema supports it. If it fails due to schema, 
    // we might need to handle it, but we assume the user will update the schema.
    if (name) {
      insertData.name = name;
    }

    const { data, error } = await supabase
      .from("saved_colors")
      .insert([insertData])
      .select("id, hex_code, name")
      .single();

    if (error || !data) {
      console.error("Error inserting color:", error);
      toast({
        title: "Error",
        description: "Failed to save the color.",
        variant: "destructive",
      });
      setMascotMood("neutral");
    } else {
      setSavedColors((prev) => [{ id: data.id, hex: color, name: data.name }, ...prev]);
      setShowCamera(false);
      toast({
        title: "Color Captured",
        description: `Color ${color} has been saved to your collection.`,
      });
      setMascotMood("excited");
      setTimeout(() => setMascotMood("happy"), 3000);
      handleShowYay();
    }
  };

  const handleColorAdd = async (color: string, name?: string) => {
    if (!session) return;

    const insertData: any = {
      user_id: session.user.id,
      hex_code: color,
    };
    if (name) insertData.name = name;

    const { data, error } = await supabase
      .from("saved_colors")
      .insert([insertData])
      .select("id, hex_code, name")
      .single();

    if (error || !data) {
      console.error("Error inserting color:", error);
      toast({
        title: "Error",
        description: "Failed to save the color.",
        variant: "destructive",
      });
      setMascotMood("neutral");
    } else {
      setSavedColors((prev) => [{ id: data.id, hex: color, name: data.name }, ...prev]);
      toast({
        title: "Color Added",
        description: `Color ${color} has been saved to your collection.`,
      });
      setMascotMood("excited");
      setTimeout(() => setMascotMood("happy"), 3000);
      handleShowYay();
    }
  };

  const handleClearColors = async () => {
    if (!session) return;

    const { error } = await supabase
      .from("saved_colors")
      .delete()
      .eq("user_id", session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to clear colors.",
        variant: "destructive",
      });
      setMascotMood("neutral");
    } else {
      setSavedColors([]);
      toast({
        title: "Colors Cleared",
        description: "All saved colors have been removed.",
      });
      setMascotMood("happy");
    }
  };

  const handleDeleteColor = async (id: string) => {
    if (!session) return;

    const { error } = await supabase
      .from("saved_colors")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id); // belt-and-suspenders RLS guard

    if (error) {
      console.error("Error deleting color:", error);
      toast({
        title: "Error",
        description: "Failed to remove the color.",
        variant: "destructive",
      });
    } else {
      setSavedColors((prev) => prev.filter((c) => c.id !== id));
      toast({
        title: "Color Removed",
        description: "Color removed from your collection.",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleShop = (color: string, category: string = "All") => {
    setSelectedColor(color);
    setSelectedShopCategory(category);
    setShowShoppingModal(true);
  };

  // handleColorSaveFromDiscover inserts immediately into the color grid.
  // Since we don't have the DB-generated id yet we use a temp id;
  // UserProfileInitializer will re-hydrate with real ids on next mount.
  const handleColorSaveFromDiscover = (color: { hex: string, name?: string }) => {
    setSavedColors((prev) => [
      { id: `temp-${Date.now()}`, hex: color.hex, name: color.name },
      ...prev,
    ]);
  };

  // Called by UserProfileInitializer once the initial fetch completes.
  const handleColorsLoaded = React.useCallback((colors: SavedColor[]) => {
    setSavedColors(colors);
    setIsLoadingColors(false);
  }, []);

  return {
    showCamera,
    setShowCamera,
    showShoppingModal,
    setShowShoppingModal,
    isTourActive,
    setIsTourActive,
    selectedColor,
    setSelectedColor,
    selectedShopCategory,
    setSelectedShopCategory,
    savedColors,
    setSavedColors: (colors) => {
      // Allow external callers (UserProfileInitializer) to set colors
      // and simultaneously mark loading as done.
      setSavedColors(colors as SavedColor[]);
      setIsLoadingColors(false);
    },
    mascotMood,
    setMascotMood,
    activeTab,
    setActiveTab,
    showYay,
    isLoadingColors,
    handleShowYay,
    handleColorCapture,
    handleColorAdd,
    handleClearColors,
    handleDeleteColor,
    handleLogout,
    handleShop,
    handleColorSaveFromDiscover,
  };
}
