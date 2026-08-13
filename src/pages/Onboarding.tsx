import SignupOnboarding from "@/components/onboarding/SignupOnboarding";
import React, { useEffect } from "react";

const Onboarding: React.FC = () => {
  useEffect(() => {
    document.title = "Complete your profile | TintPicks"; // SEO title
  }, []);

  return (
    <div className="min-h-screen bg-ghibli-gradient relative overflow-hidden flex items-center justify-center px-4">
      <div className="clouds-container absolute inset-0 pointer-events-none overflow-hidden"></div>
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
              linear-gradient(to right, rgba(122, 160, 196, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(122, 160, 196, 0.2) 1px, transparent 1px)
            `,
          backgroundSize: "40px 40px",
        }}
      />

      <SignupOnboarding />
    </div>
  );
};

export default Onboarding;
