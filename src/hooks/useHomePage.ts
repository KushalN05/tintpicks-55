
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type MascotMood = "happy" | "neutral" | "excited";

export interface SavedColor {
  id: string;
  hex: string;
}

export interface UseHomePageProps {
  showCamera: boolean;
  setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
  showShoppingModal: boolean;
  setShowShoppingModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  handleColorCapture: (color: string) => Promise<void>;
  handleColorAdd: (color: string) => Promise<void>;
  handleClearColors: () => Promise<void>;
  handleDeleteColor: (id: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleShop: (color: string) => void;
  handleColorSaveFromDiscover: (color: { hex: string }) => void;
}

export function useHomePage(): UseHomePageProps {
  const [showCamera, setShowCamera] = React.useState(false);
  const [showShoppingModal, setShowShoppingModal] = React.useState(false);
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
      navigate("/login");
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

  const handleColorCapture = async (color: string) => {
    if (!session) return;

    const { data, error } = await supabase
      .from("saved_colors")
      .insert([
        {
          user_id: session.user.id,
          hex_code: color,
        },
      ])
      .select("id, hex_code")
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
      setSavedColors((prev) => [{ id: data.id, hex: color }, ...prev]);
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

  const handleColorAdd = async (color: string) => {
    if (!session) return;

    const { data, error } = await supabase
      .from("saved_colors")
      .insert([
        {
          user_id: session.user.id,
          hex_code: color,
        },
      ])
      .select("id, hex_code")
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
      setSavedColors((prev) => [{ id: data.id, hex: color }, ...prev]);
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
    navigate("/login");
  };

  const handleShop = (color: string) => {
    setSelectedColor(color);
    setShowShoppingModal(true);
  };

  // handleColorSaveFromDiscover inserts immediately into the color grid.
  // Since we don't have the DB-generated id yet we use a temp id;
  // UserProfileInitializer will re-hydrate with real ids on next mount.
  const handleColorSaveFromDiscover = (color: { hex: string }) => {
    setSavedColors((prev) => [
      { id: `temp-${Date.now()}`, hex: color.hex },
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
    selectedColor,
    setSelectedColor,
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
