import React from 'react';
import { sampleGarments } from '@/data/catalogue';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface SampleSearchesProps {
  onSelectSample: (scenarioId: 'jacket' | 'cardigan' | 'rugby' | 'jeans') => void;
}

export const SampleSearches: React.FC<SampleSearchesProps> = ({ onSelectSample }) => {
  return (
    <section id="sample-searches" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E6E2DC]">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#285C47]">
            Buildathon Demo Scenarios
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#191919] mt-1">
            Try a curated sample search
          </h2>
        </div>
        <p className="text-sm text-[#77736F] mt-2 sm:mt-0 max-w-md text-left sm:text-right">
          Click any garment below to test exact match retrieval and fine detail comparison.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleGarments.map(item => (
          <div
            key={item.id}
            onClick={() => onSelectSample(item.id)}
            className="group cursor-pointer bg-white rounded-lg border border-[#E6E2DC] overflow-hidden hover:border-[#285C47] hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            {/* Image Preview with Tag */}
            <div className="relative aspect-square w-full bg-[#FAF9F6] overflow-hidden border-b border-[#E6E2DC]">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#191919]/80 backdrop-blur-xs text-white">
                  {item.tag}
                </span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#285C47] shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-[#285C47] uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-base font-semibold text-[#191919] mt-1 group-hover:text-[#285C47] transition-colors leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-[#77736F] mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6E2DC]/60 flex items-center justify-between text-xs font-medium text-[#285C47]">
                <span>Run scenario</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
