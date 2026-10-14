import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroUploaderProps {
  onImageSelected: (file: File | string, scenarioId?: 'jacket' | 'cardigan' | 'rugby' | 'jeans') => void;
  onLaunchCamera: () => void;
  onScrollToSamples: () => void;
}

export const HeroUploader: React.FC<HeroUploaderProps> = ({
  onImageSelected,
  onLaunchCamera,
  onScrollToSamples,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image (JPG, PNG, or WebP).');
      return;
    }
    const maxSize = 15 * 1024 * 1024; // 15MB limit
    if (file.size > maxSize) {
      setErrorMessage('File size exceeds the 15MB limit. Please choose a smaller photo.');
      return;
    }

    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Editorial Tagline Pill */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#E8EFE9] text-[#285C47] text-xs font-semibold tracking-wide uppercase mb-6 shadow-xs border border-[#285C47]/15">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Visual Precision Clothing Search</span>
      </div>

      {/* Confident Hero Headline */}
      <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#191919] max-w-3xl mx-auto leading-[1.12]">
        Found it. Now <span className="italic font-serif-cormorant font-normal text-[#285C47]">find</span> it.
      </h1>

      {/* Supporting Copy */}
      <p className="mt-5 text-base sm:text-lg text-[#77736F] max-w-2xl mx-auto leading-relaxed">
        Upload a photo of any clothing item. Our visual search finds the closest matches across the catalogue, down to colour, cut, pattern, and details.
      </p>

      {/* Dominant Upload Component */}
      <div className="mt-10 max-w-2xl mx-auto">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed p-8 sm:p-12 transition-all duration-300 cursor-pointer bg-white group ${
            isDragging
              ? 'border-[#285C47] bg-[#E8EFE9]/40 scale-[1.01]'
              : 'border-[#E6E2DC] hover:border-[#285C47]/70 hover:shadow-md'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* Central Icons */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FAF9F6] border border-[#E6E2DC] flex items-center justify-center text-[#285C47] group-hover:scale-110 transition-transform shadow-xs">
            <Upload className="w-7 h-7 stroke-[1.6]" />
          </div>

          <h3 className="text-lg font-medium text-[#191919] mb-1">
            Drop your image here
          </h3>
          <p className="text-sm text-[#77736F] mb-6">
            Or choose a photo from your device (JPG, PNG, or WebP up to 15MB)
          </p>

          {/* Interactive Button Group */}
          <div className="flex flex-wrap items-center justify-center gap-3" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-md bg-[#285C47] text-white text-sm font-medium hover:bg-[#1F4A39] transition-all shadow-sm active:scale-98"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Choose photo</span>
            </button>

            <button
              type="button"
              onClick={onLaunchCamera}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-md bg-white border border-[#E6E2DC] text-[#191919] text-sm font-medium hover:bg-[#FAF9F6] hover:border-[#CCC7BE] transition-all shadow-xs active:scale-98"
            >
              <Camera className="w-4 h-4 text-[#285C47]" />
              <span>Take photo</span>
            </button>

            <button
              type="button"
              onClick={onScrollToSamples}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-md bg-[#FAF9F6] border border-transparent text-[#77736F] text-sm font-medium hover:text-[#191919] hover:bg-[#F4F1EA] transition-all"
            >
              <span>Try a sample photo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-[#9E2A2B] font-medium">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Reassurance & Utility Hints */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77736F] px-2 gap-2">
          <span>Works with screenshots, street-style photos, product images and more.</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#285C47]" />
            <span>Private & session-based</span>
          </span>
        </div>
      </div>
    </section>
  );
};
