import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export interface SignupOnboardingData {
  name: string;
  dob: string; // ISO yyyy-mm-dd
  age: number;
  gender: string;
  pronouns: string;
  consent: boolean;
}

const calcAge = (dob: string) => {
  if (!dob) return 0;
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
};

const genders = ["Female", "Male", "Non-binary", "Prefer not to say"];
const pronouns = ["she/her", "he/him", "they/them", "prefer not to say"];

const SignupOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SignupOnboardingData>({
    name: "",
    dob: "",
    age: 0,
    gender: "",
    pronouns: "",
    consent: false,
  });

  useEffect(() => {
    // SEO basics
    document.title = "Onboarding | TintPicks";
  }, []);

  const minAge = 13;
  const canNext = useMemo(() => {
    if (step === 0) return data.name.trim().length > 1;
    if (step === 1) return Boolean(data.dob) && data.age >= minAge;
    if (step === 2) return Boolean(data.gender) && Boolean(data.pronouns);
    if (step === 3) return data.consent;
    return false;
  }, [data, step]);

  const handleDobChange = (value: string) => {
    const age = calcAge(value);
    setData((d) => ({ ...d, dob: value, age }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) throw new Error("No user session");

      // Persist extended onboarding
      await (supabase as any).from("user_onboarding").insert({
        user_id: user.id,
        name: data.name,
        email: user.email ?? "",
        dob: data.dob,
        age: data.age,
        gender: data.gender,
        pronouns: data.pronouns,
      });

      // Update profile basics
      await supabase.from("profiles").upsert({
        id: user.id,
        display_name: data.name,
        email: user.email ?? "",
        onboarding_completed: true,
      });

      // Welcome email
      if (user.email) {
        await supabase.functions.invoke("send-welcome-email", {
          body: { email: user.email, name: data.name },
        });
      }

      // Clear flag and start tour
      localStorage.removeItem("needsOnboarding");
      navigate("/?tour=true");
    } catch (e: any) {
      setError(e.message || "Failed to save onboarding");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="w-full max-w-xl mx-auto">
      <section className="ghibli-card p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-ghibli-forest">Welcome! Let’s personalize TintPicks</h1>
          <p className="text-ghibli-forest/70">Only takes a minute. You can edit this later in your profile.</p>
        </div>

        {/* Progress */}
        <div className="w-full bg-ghibli-cream h-2 rounded-full mb-6">
          <div
            className="bg-ghibli-blue h-2 rounded-full transition-all"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <Label htmlFor="name" className="text-ghibli-forest">Your name</Label>
            <Input
              id="name"
              value={data.name}
              placeholder="e.g. Alex"
              onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Label htmlFor="dob" className="text-ghibli-forest">Date of birth</Label>
            <Input
              id="dob"
              type="date"
              value={data.dob}
              onChange={(e) => handleDobChange(e.target.value)}
            />
            {data.dob && (
              <p className="text-sm text-ghibli-forest/70">We calculate your age automatically: <span className="font-medium text-ghibli-forest">{data.age}</span></p>
            )}
            <p className="text-xs text-ghibli-forest/60">You must be at least {minAge}.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-ghibli-forest mb-2 block">Gender</Label>
              <RadioGroup value={data.gender} onValueChange={(v) => setData((d) => ({ ...d, gender: v }))}>
                {genders.map((g) => (
                  <div key={g} className="flex items-center space-x-2">
                    <RadioGroupItem id={`gender-${g}`} value={g} />
                    <Label htmlFor={`gender-${g}`}>{g}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-ghibli-forest mb-2 block">Pronouns</Label>
              <RadioGroup value={data.pronouns} onValueChange={(v) => setData((d) => ({ ...d, pronouns: v }))}>
                {pronouns.map((p) => (
                  <div key={p} className="flex items-center space-x-2">
                    <RadioGroupItem id={`pr-${p}`} value={p} />
                    <Label htmlFor={`pr-${p}`}>{p}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-ghibli-forest">Review</h2>
            <ul className="text-ghibli-forest/80 space-y-1">
              <li><span className="font-medium">Name:</span> {data.name}</li>
              <li><span className="font-medium">DOB:</span> {data.dob}</li>
              <li><span className="font-medium">Age:</span> {data.age}</li>
              <li><span className="font-medium">Gender:</span> {data.gender}</li>
              <li><span className="font-medium">Pronouns:</span> {data.pronouns}</li>
            </ul>
            <label className="flex items-center gap-2 text-ghibli-forest/80">
              <input
                type="checkbox"
                checked={data.consent}
                onChange={(e) => setData((d) => ({ ...d, consent: e.target.checked }))}
              />
              I agree to save this information to personalize my experience.
            </label>
          </div>
        )}

        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            className="border-ghibli-blue/30 text-ghibli-forest hover:bg-ghibli-cream/50"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || saving}
          >
            Back
          </Button>

          {step < 3 ? (
            <Button
              className="bg-ghibli-blue text-white hover:bg-ghibli-blue/90"
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={!canNext || saving}
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-ghibli-blue text-white hover:bg-ghibli-blue/90"
              onClick={handleSubmit}
              disabled={!canNext || saving}
            >
              {saving ? "Saving..." : "Complete setup"}
            </Button>
          )}
        </div>
      </section>
    </main>
  );
};

export default SignupOnboarding;
