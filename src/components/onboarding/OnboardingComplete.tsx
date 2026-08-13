import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import BlobMascot from '@/components/BlobMascot';
import { OnboardingData } from './OnboardingSteps';

interface OnboardingCompleteProps {
  data: OnboardingData;
  onStartJourney: () => void;
}

const OnboardingComplete = ({ data, onStartJourney }: OnboardingCompleteProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="ghibli-card p-8 space-y-8">
        {/* Success Animation */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto animate-scale-in">
            <BlobMascot size="lg" mood="excited" />
          </div>
          <div className="absolute inset-0 animate-glow">
            <Sparkles className="w-8 h-8 text-ghibli-purple absolute top-4 right-1/3 animate-bounce-subtle" />
            <Sparkles className="w-6 h-6 text-ghibli-pink absolute bottom-8 left-1/4 animate-bounce-subtle" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="w-4 h-4 text-ghibli-orange absolute top-12 left-1/3 animate-bounce-subtle" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-ghibli-forest font-ghibli">
            Perfect, {data.name}! 🎨
          </h2>
          <p className="text-lg text-ghibli-forest/80">
            Your color journey is ready to begin. I've personalized TintPicks just for you!
          </p>
        </div>

        {/* Personalized Summary */}
        <div className="bg-ghibli-cream/50 rounded-lg p-6 space-y-4 text-left">
          <h3 className="text-xl font-semibold text-ghibli-forest mb-4 text-center">
            Here's what I've prepared for you:
          </h3>
          
          <div className="space-y-3 text-ghibli-forest">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-ghibli-blue rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Experience Level:</span>{' '}
                {data.colorExperience === 'beginner' && 'Beginner-friendly tutorials and guides'}
                {data.colorExperience === 'intermediate' && 'Intermediate tips and advanced features'}
                {data.colorExperience === 'advanced' && 'Pro tools and expert-level content'}
              </div>
            </div>
            
            {data.interests.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-ghibli-pink rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Interests:</span>{' '}
                  Content focused on {data.interests.slice(0, 2).join(' and ')}
                  {data.interests.length > 2 && ` and ${data.interests.length - 2} more`}
                </div>
              </div>
            )}
            
            {data.goals.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-ghibli-green rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Goals:</span>{' '}
                  Recommendations to help you {data.goals[0].toLowerCase()}
                  {data.goals.length > 1 && ` and achieve ${data.goals.length - 1} other goals`}
                </div>
              </div>
            )}
            
            {data.stylePreference && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-ghibli-purple rounded-full mt-2 flex-shrink-0"></div>
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
            className="bg-ghibli-blue text-white hover:bg-ghibli-blue/90 px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all group"
          >
            Start My Color Journey
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-ghibli-forest/60 mt-4">
            Ready to discover your perfect colors? Let's go!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;