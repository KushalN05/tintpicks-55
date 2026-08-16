import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { OnboardingData } from './OnboardingSteps';

interface OnboardingCompleteProps {
  data: OnboardingData;
  onStartJourney: () => void;
}

const OnboardingComplete = ({ data, onStartJourney }: OnboardingCompleteProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="minimal-card p-8 space-y-8">
        {/* Welcome Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Perfect, {data.name}! 🎨
          </h2>
          <p className="text-muted-foreground">
            Your color journey is ready to begin.
          </p>
        </div>

        {/* Personalized Summary */}
        <div className="bg-muted rounded-md p-6 space-y-4 text-left">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            Here's what I've prepared for you:
          </h3>
          
          <div className="space-y-3 text-foreground">
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Experience Level:</span>{' '}
                {data.colorExperience === 'beginner' && 'Beginner-friendly tutorials and guides'}
                {data.colorExperience === 'intermediate' && 'Intermediate tips and advanced features'}
                {data.colorExperience === 'advanced' && 'Pro tools and expert-level content'}
              </div>
            </div>
            
            {data.interests.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Interests:</span>{' '}
                  Content focused on {data.interests.slice(0, 2).join(' and ')}
                  {data.interests.length > 2 && ` and ${data.interests.length - 2} more`}
                </div>
              </div>
            )}
            
            {data.goals.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Goals:</span>{' '}
                  Recommendations to help you {data.goals[0].toLowerCase()}
                  {data.goals.length > 1 && ` and achieve ${data.goals.length - 1} other goals`}
                </div>
              </div>
            )}
            
            {data.stylePreference && (
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Style:</span>{' '}
                  Color palettes curated for your{' '}
                  {data.stylePreference.replace(/([A-Z])/g, ' $1').toLowerCase()} aesthetic
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-4">
          <Button
            onClick={onStartJourney}
            className="px-8 py-6 rounded-md text-lg transition-all group"
          >
            Start My Color Journey
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Ready to discover your perfect colors? Let's go!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;