import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Palette, Camera, Sparkles, Heart } from 'lucide-react';
import BlobMascot from '@/components/BlobMascot';

interface OnboardingStepsProps {
  onComplete: (data: OnboardingData) => void;
  onBack: () => void;
}

export interface OnboardingData {
  name: string;
  colorExperience: string;
  interests: string[];
  goals: string[];
  stylePreference: string;
}

const OnboardingSteps = ({ onComplete, onBack }: OnboardingStepsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    colorExperience: '',
    interests: [],
    goals: [],
    stylePreference: '',
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: 'interests' | 'goals', value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-ghibli-forest/70">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-ghibli-forest/70">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-ghibli-cream" />
      </div>

      {/* Step Content */}
      <div className="ghibli-card p-8 mb-6 min-h-[400px] flex flex-col justify-between">
        {/* Step 1: Welcome & Name */}
        {currentStep === 1 && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto animate-float">
              <BlobMascot size="lg" mood="happy" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-ghibli-forest mb-2 font-ghibli">
                Welcome to TintPicks!
              </h2>
              <p className="text-ghibli-forest/70 mb-6">
                I'm Tinti, your color companion. Let's create your perfect color journey together.
              </p>
            </div>
            <div className="space-y-4 max-w-sm mx-auto">
              <Label htmlFor="name" className="text-ghibli-forest font-medium">
                What should I call you?
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Enter your name"
                className="bg-white/70 border-ghibli-blue/30 focus:border-ghibli-blue text-center"
              />
            </div>
          </div>
        )}

        {/* Step 2: Color Experience */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Palette className="w-16 h-16 text-ghibli-blue mx-auto mb-4 animate-bounce-subtle" />
              <h2 className="text-2xl font-bold text-ghibli-forest mb-2 font-ghibli">
                How comfortable are you with colors?
              </h2>
              <p className="text-ghibli-forest/70">
                This helps me tailor the experience just for you.
              </p>
            </div>
            <RadioGroup
              value={formData.colorExperience}
              onValueChange={(value) => updateFormData('colorExperience', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-ghibli-blue/20 hover:bg-ghibli-cream/30 transition-colors">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                  <div className="font-medium text-ghibli-forest">I'm new to color coordination</div>
                  <div className="text-sm text-ghibli-forest/60">I'd love to learn the basics</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-ghibli-blue/20 hover:bg-ghibli-cream/30 transition-colors">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <div className="font-medium text-ghibli-forest">I have some experience</div>
                  <div className="text-sm text-ghibli-forest/60">I know some basics but want to improve</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-ghibli-blue/20 hover:bg-ghibli-cream/30 transition-colors">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                  <div className="font-medium text-ghibli-forest">I'm quite experienced</div>
                  <div className="text-sm text-ghibli-forest/60">I'm looking for advanced tools and inspiration</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 3: Interests */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="w-16 h-16 text-ghibli-pink mx-auto mb-4 animate-glow" />
              <h2 className="text-2xl font-bold text-ghibli-forest mb-2 font-ghibli">
                What interests you most?
              </h2>
              <p className="text-ghibli-forest/70">
                Select all that apply. This helps me show you relevant content.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Fashion & Style',
                'Home Decor',
                'Art & Design',
                'Photography',
                'Makeup & Beauty',
                'Crafts & DIY',
                'Nature & Outdoors',
                'Travel'
              ].map((interest) => (
                <div
                  key={interest}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    formData.interests.includes(interest)
                      ? 'border-ghibli-blue bg-ghibli-cream/50'
                      : 'border-ghibli-blue/20 hover:bg-ghibli-cream/30'
                  }`}
                  onClick={() => toggleArrayValue('interests', interest)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={formData.interests.includes(interest)}
                      onChange={() => {}}
                      className="data-[state=checked]:bg-ghibli-blue"
                    />
                    <Label className="font-medium text-ghibli-forest cursor-pointer">
                      {interest}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Goals */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Sparkles className="w-16 h-16 text-ghibli-purple mx-auto mb-4 animate-wiggle" />
              <h2 className="text-2xl font-bold text-ghibli-forest mb-2 font-ghibli">
                What are your color goals?
              </h2>
              <p className="text-ghibli-forest/70">
                Let me know what you'd like to achieve with TintPicks.
              </p>
            </div>
            <div className="space-y-3">
              {[
                'Build a coordinated wardrobe',
                'Learn color theory basics',
                'Find my perfect color palette',
                'Improve my style confidence',
                'Discover new color combinations',
                'Create harmonious spaces',
                'Enhance my creative projects'
              ].map((goal) => (
                <div
                  key={goal}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    formData.goals.includes(goal)
                      ? 'border-ghibli-green bg-ghibli-cream/50'
                      : 'border-ghibli-blue/20 hover:bg-ghibli-cream/30'
                  }`}
                  onClick={() => toggleArrayValue('goals', goal)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={formData.goals.includes(goal)}
                      onChange={() => {}}
                      className="data-[state=checked]:bg-ghibli-green"
                    />
                    <Label className="font-medium text-ghibli-forest cursor-pointer">
                      {goal}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Style Preference */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Camera className="w-16 h-16 text-ghibli-orange mx-auto mb-4 animate-float" />
              <h2 className="text-2xl font-bold text-ghibli-forest mb-2 font-ghibli">
                What's your style vibe?
              </h2>
              <p className="text-ghibli-forest/70">
                This helps me recommend colors that match your aesthetic.
              </p>
            </div>
            <RadioGroup
              value={formData.stylePreference}
              onValueChange={(value) => updateFormData('stylePreference', value)}
              className="space-y-4"
            >
              {[
                { id: 'minimalist', label: 'Minimalist & Clean', desc: 'Simple, elegant, timeless' },
                { id: 'bohemian', label: 'Bohemian & Artistic', desc: 'Free-spirited, eclectic, creative' },
                { id: 'classic', label: 'Classic & Sophisticated', desc: 'Traditional, refined, polished' },
                { id: 'modern', label: 'Modern & Trendy', desc: 'Contemporary, fashion-forward, bold' },
                { id: 'romantic', label: 'Romantic & Soft', desc: 'Gentle, feminine, dreamy' },
                { id: 'eclectic', label: 'Eclectic & Unique', desc: 'Mix-and-match, personal, expressive' }
              ].map((style) => (
                <div
                  key={style.id}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-ghibli-blue/20 hover:bg-ghibli-cream/30 transition-colors"
                >
                  <RadioGroupItem value={style.id} id={style.id} />
                  <Label htmlFor={style.id} className="flex-1 cursor-pointer">
                    <div className="font-medium text-ghibli-forest">{style.label}</div>
                    <div className="text-sm text-ghibli-forest/60">{style.desc}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="border-ghibli-blue/30 text-ghibli-forest hover:bg-ghibli-cream/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Back to Login' : 'Previous'}
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={
            (currentStep === 1 && !formData.name) ||
            (currentStep === 2 && !formData.colorExperience) ||
            (currentStep === 5 && !formData.stylePreference)
          }
          className="bg-ghibli-green text-white hover:bg-ghibli-green/90"
        >
          {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSteps;