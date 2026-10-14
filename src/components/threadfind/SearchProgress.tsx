import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface SearchProgressProps {
  queryImageUrl: string;
}

const SEARCH_STAGES = [
  'Detecting your clothing item',
  'Analysing colour, shape and details',
  'Searching the visual catalogue',
  'Ranking the closest matches',
];

export const SearchProgress: React.FC<SearchProgressProps> = ({ queryImageUrl }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const intervals = [350, 450, 450, 400];
    let step = 0;

    const runSteps = () => {
      if (step < SEARCH_STAGES.length - 1) {
        step++;
        setCurrentStageIndex(step);
        setTimeout(runSteps, intervals[step]);
      }
    };

    const timer = setTimeout(runSteps, intervals[0]);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      {/* Scanning Query Preview */}
      <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden border border-[#285C47]/40 shadow-lg bg-white mb-8">
        <img
          src={queryImageUrl}
          alt="Searching item"
          className="w-full h-full object-cover"
        />

        {/* Laser Scanner Beam */}
        <div className="animate-laser-scan" />

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

        {/* Pulse Target Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full border border-white/60 animate-pulse-ring" />
        </div>
      </div>

      {/* Primary Stage Status */}
      <div className="mb-6">
        <span className="text-xs uppercase tracking-wider text-[#285C47] font-semibold">
          Visual Vector Pipeline
        </span>
        <h2 className="font-editorial text-2xl text-[#191919] mt-1 transition-all">
          {SEARCH_STAGES[currentStageIndex]}
        </h2>
      </div>

      {/* 4 Step Progress Indicators */}
      <div className="space-y-3 max-w-xs mx-auto text-left">
        {SEARCH_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div
              key={stage}
              className={`flex items-center space-x-3 text-xs transition-opacity duration-300 ${
                isDone
                  ? 'text-[#285C47] font-medium'
                  : isCurrent
                  ? 'text-[#191919] font-semibold'
                  : 'text-[#77736F]/50'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#285C47]" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-[#285C47] animate-spin" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E6E2DC]" />
                )}
              </div>
              <span>{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
