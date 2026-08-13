
import React from "react";

interface ColorInfo {
  hex: string;
  name: string;
  category?: string;
}

interface RecommendationListProps {
  recommendations: ColorInfo[];
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => (
  <div className="flex gap-3 w-full max-w-md">
    {recommendations.map((color) => (
      <div
        key={color.hex}
        className="flex-1 rounded-xl overflow-hidden shadow border border-gray-200 bg-white flex flex-col items-center p-2"
      >
        <div
          className="h-16 w-full rounded-md mb-2"
          style={{ backgroundColor: color.hex }}
        />
        <div className="w-full flex-1 flex flex-col items-center">
          <p className="text-xs font-semibold truncate text-ghibli-forest">{color.name}</p>
          <p className="text-[10px] text-ghibli-blue/70 capitalize">{color.category || ''}</p>
          <span className="mt-1 text-[11px] font-mono text-ghibli-forest/40">{color.hex}</span>
        </div>
      </div>
    ))}
  </div>
);

export default RecommendationList;
