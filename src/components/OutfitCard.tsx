
import React from "react";

interface OutfitInfo {
  id: string;
  name: string;
  imageUrl: string;
  dominantColor: string;
  category?: string;
}

interface OutfitCardProps {
  outfit: OutfitInfo;
  children?: React.ReactNode;
  animateProps?: React.HTMLAttributes<HTMLDivElement>;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, children, animateProps }) => (
  <div
    className="shadow-2xl rounded-3xl overflow-hidden relative w-full max-w-md aspect-[3/4] bg-white border-2 border-ghibli-blue/30"
    {...animateProps}
  >
    <img
      src={outfit.imageUrl}
      alt={outfit.name}
      className="object-cover h-full w-full"
      style={{ objectPosition: "center" }}
    />
    <div
      className="absolute bottom-0 left-0 w-full px-5 py-4 flex flex-row items-center justify-between"
      style={{ background: "linear-gradient(to top, rgba(252,252,252,0.96) 85%, rgba(255,255,255,0.3) 100%)" }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xl font-bold text-ghibli-forest mb-1">
          {outfit.name}
        </span>
        <span className="text-base font-medium capitalize text-ghibli-blue/90">
          {outfit.category || "General"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-7 h-7 rounded-full border border-gray-200 shadow"
          style={{ backgroundColor: outfit.dominantColor }}
        />
        <span className="ml-1 text-sm text-ghibli-forest">{outfit.dominantColor}</span>
      </div>
    </div>
    {children}
  </div>
);

export default OutfitCard;
