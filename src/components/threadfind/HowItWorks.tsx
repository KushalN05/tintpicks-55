import React from 'react';
import { Camera, Eye, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Camera,
      title: 'Snap or upload',
      description: 'Upload any street-style photo, TikTok screenshot, or vintage piece from your phone or camera.',
    },
    {
      num: '02',
      icon: Eye,
      title: 'Compare visually',
      description: 'Vector embeddings analyze silhouette, cut, pattern frequency, collar shape, and hardware details.',
    },
    {
      num: '03',
      icon: CheckCircle2,
      title: 'Find your match',
      description: 'Discover ranked results from exact items and near-identical twins to close style alternatives.',
    },
  ];

  return (
    <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#E6E2DC]">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#285C47]">
          The Experience
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl text-[#191919] mt-2">
          How ThreadFind Works
        </h2>
        <p className="text-sm text-[#77736F] mt-2">
          Find the clothes you see in the real world with visual precision, not keyword guesswork.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map(step => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative p-6 rounded-lg bg-white border border-[#E6E2DC] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-editorial text-2xl font-bold text-[#E6E2DC] select-none">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#E8EFE9] flex items-center justify-center text-[#285C47]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[#191919] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#77736F] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
