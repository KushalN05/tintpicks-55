
import React from "react";
import { Heart, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwiperActionsProps {
  onDislike: () => void;
  onSave: () => void;
  onLike: () => void;
}

const SwiperActions: React.FC<SwiperActionsProps> = ({ onDislike, onSave, onLike }) => (
  <div className="flex flex-row items-center justify-center gap-7 mt-7 mb-0 w-full">
    <Button
      onClick={onDislike}
      variant="outline"
      size="icon"
      className="rounded-full border-2 border-red-400 text-red-500 hover:bg-red-50 h-16 w-16 flex items-center justify-center shadow-md transition"
      aria-label="Dislike"
    >
      <X className="h-7 w-7" />
    </Button>
    <Button
      onClick={onSave}
      variant="ghost"
      size="icon"
      className="rounded-full border-2 border-purple-400 text-purple-500 hover:bg-purple-50 h-16 w-16 flex items-center justify-center shadow-md transition"
      aria-label="Save"
    >
      <Save className="h-7 w-7" />
    </Button>
    <Button
      onClick={onLike}
      variant="outline"
      size="icon"
      className="rounded-full border-2 border-green-400 text-green-500 hover:bg-green-50 h-16 w-16 flex items-center justify-center shadow-md transition"
      aria-label="Like"
    >
      <Heart className="h-7 w-7" />
    </Button>
  </div>
);

export default SwiperActions;
