import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Search } from "lucide-react";

export interface SignupOnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  work: string[];
  style: string[];
  referral: string[];
  brands: string[];
}

const workOptions = [
  "Lawyer", "Marketing lead", "Software Engineer", "College Student",
  "High School Student", "Teacher", "Consultant", "Nurse",
  "Product Designer", "Human Resources"
];

const styleOptions = ["Womenswear", "Menswear"];

const referralOptions = [
  "Tiktok", "Reddit", "ChatGPT", "Word of mouth", "Instagram",
  "Friend", "Google", "TV Show", "Other"
];

const brandOptions = [
  "APC", "AMI Paris", "Acne Studios", "Alo", "Alexander McQueen",
  "Aries", "ASOS", "Balenciaga", "Bottega Veneta", "Burberry",
  "Carhartt WIP", "COS", "Dior", "Gucci", "H&M", "Zara"
];

const SignupOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<SignupOnboardingData>({
    firstName: "",
    lastName: "",
    email: "",
    work: [],
    style: [],
    referral: [],
    brands: [],
  });

  const [brandSearch, setBrandSearch] = useState("");

  // Check if we can prefill email from session
  useEffect(() => {
    document.title = "Onboarding | TintPicks";
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    };
    fetchSession();
  }, []);

  const handleNext = () => {
    if (step < 5) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  const handleSkip = () => {
    if (step < 5) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) throw new Error("No user session");

      const preferences = {
        work: data.work,
        style: data.style,
        referral: data.referral,
        brands: data.brands,
      };

      // Update profile basics & preferences
      await supabase.from("profiles").upsert({
        id: user.id,
        display_name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email || user.email || "",
        onboarding_completed: true,
        preferences: preferences,
      });

      // Clear flag and start tour
      localStorage.removeItem("needsOnboarding");
      navigate("/app?tour=true");
    } catch (e: any) {
      setError(e.message || "Failed to save onboarding");
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (field: keyof SignupOnboardingData, item: string) => {
    setData(prev => {
      const arr = prev[field] as string[];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  const isNextDisabled = () => {
    if (step === 0) return data.firstName.trim().length === 0 || data.lastName.trim().length === 0;
    if (step === 1) return data.email.trim().length === 0 || !data.email.includes("@");
    if (step === 2) return data.work.length === 0;
    if (step === 3) return data.style.length === 0;
    if (step === 4) return data.referral.length === 0;
    if (step === 5) return data.brands.length < 3; // "Choose 3 or more brands"
    return false;
  };

  const filteredBrands = brandOptions.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full max-w-md mx-auto relative font-sans">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-6 py-4 absolute top-0 w-full z-10">
        <button onClick={handleBack} className={`p-2 -ml-2 transition-opacity ${step === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button onClick={handleSkip} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Skip
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-20 px-6 pb-24 overflow-y-auto">
        
        {/* Step 0: Name */}
        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Your name</h1>
            <p className="text-muted-foreground text-sm mb-8">Please enter your first and last name to continue.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">First name</label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={e => setData({ ...data, firstName: e.target.value })}
                  className="w-full border-b border-border bg-transparent py-2 text-lg focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Jane"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Last name</label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={e => setData({ ...data, lastName: e.target.value })}
                  className="w-full border-b border-border bg-transparent py-2 text-lg focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Your email for shopping</h1>
            <p className="text-muted-foreground text-sm mb-8">Forward your receipts from this address to import your purchases.</p>
            
            <div>
              <input
                type="email"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                className="w-full border-b border-border bg-transparent py-2 text-lg focus:outline-none focus:border-foreground transition-colors"
                placeholder="jane.doe@example.com"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Step 2: Work */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-3xl font-bold tracking-tight mb-2">What do you do for work?</h1>
            <p className="text-muted-foreground text-sm mb-8">We'll personalize recommendations for both workdays and weekends.</p>
            
            <div className="flex flex-wrap gap-3">
              {workOptions.map(option => {
                const isSelected = data.work.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleArrayItem("work", option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                      ${isSelected 
                        ? "border-foreground bg-foreground text-background" 
                        : "border-border text-foreground hover:border-foreground/50"}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Style */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
            <h1 className="text-3xl font-bold tracking-tight mb-2">What do you wear?</h1>
            <p className="text-muted-foreground text-sm mb-8">You can choose both options if you're interested in both styles.</p>
            
            <div className="flex gap-4 w-full mt-4">
              {styleOptions.map(option => {
                const isSelected = data.style.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => toggleArrayItem("style", option)}
                    className={`flex-1 aspect-square rounded-2xl border-2 flex items-center justify-center text-lg font-semibold transition-all duration-200
                      ${isSelected 
                        ? "border-foreground bg-muted" 
                        : "border-border/50 hover:border-border"}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Referral */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-3xl font-bold tracking-tight mb-8">How did you hear about us?</h1>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {referralOptions.map(option => {
                const isSelected = data.referral.includes(option);
                return (
                  <label key={option} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                      ${isSelected ? "bg-foreground border-foreground" : "border-border group-hover:border-foreground/50"}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-background" strokeWidth={3} />}
                    </div>
                    <span className="text-sm font-medium">{option}</span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected} 
                      onChange={() => toggleArrayItem("referral", option)} 
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Brands */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Choose 3 or more brands</h1>
            <p className="text-muted-foreground text-sm mb-6">Choose brands of clothes you currently wear or want.</p>
            
            <div className="relative mb-6">
              <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search or add brands..."
                value={brandSearch}
                onChange={e => setBrandSearch(e.target.value)}
                className="w-full bg-muted/50 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/5"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pb-10">
              {filteredBrands.map(brand => {
                const isSelected = data.brands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleArrayItem("brands", brand)}
                    className="w-full flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="text-base font-medium">{brand}</span>
                    <div className={`transition-colors ${isSelected ? "text-foreground" : "text-muted-foreground/30"}`}>
                      {/* Heart icon */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={isSelected ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      </div>

      {/* Bottom Fixed Area */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pointer-events-none flex justify-center z-20">
        <div className="w-full max-w-md pointer-events-auto">
          <button
            onClick={handleNext}
            disabled={isNextDisabled() || saving}
            className="w-full bg-foreground text-background rounded-full py-4 font-semibold text-lg
                       active:scale-[0.98] transition-all duration-200
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : (step === 5 ? "Complete" : "Continue")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupOnboarding;
