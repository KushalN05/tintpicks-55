
import React from "react";
import InteractiveMascot from "@/components/InteractiveMascot";

interface MascotSectionProps {
  mascotMood: "happy" | "neutral" | "excited";
}

const MascotSection: React.FC<MascotSectionProps> = ({ mascotMood }) => (
  <div className="md:w-1/4 flex justify-center items-center mt-6 md:mt-0">
    <InteractiveMascot 
      mood={mascotMood} 
      className="animate-float-gentle"
      onInteraction={() => console.log('Mascot interaction!')}
    />
  </div>
);

export default MascotSection;

