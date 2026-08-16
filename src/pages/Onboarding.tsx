import SignupOnboarding from "@/components/onboarding/SignupOnboarding";
import React, { useEffect } from "react";

const Onboarding: React.FC = () => {
  useEffect(() => {
    document.title = "Complete your profile | TintPicks";
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SignupOnboarding />
    </div>
  );
};

export default Onboarding;
