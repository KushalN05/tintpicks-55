import React from "react";
import HowToUseGuide from "@/components/HowToUseGuide";
import FAQ from "@/components/FAQ";

const HelpSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-ghibli-forest mb-2">
          Need Help?
        </h2>
        <p className="text-ghibli-forest/70 text-lg">
          Everything you need to know about using TintPicks
        </p>
      </div>
      
      <FAQ />
      
      <div className="mt-12">
        <HowToUseGuide />
      </div>
    </div>
  );
};

export default HelpSection;