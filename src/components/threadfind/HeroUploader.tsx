import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles, ShieldCheck, ArrowRight, Play } from 'lucide-react';

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
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <section className="relative pt-10 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Editorial Tagline Pill */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#E8EFE9] text-[#285C47] text-xs font-semibold tracking-wide uppercase mb-6 shadow-xs border border-[#285C47]/15">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Camera-to-Clothing Visual Matching</span>
      </div>

      {/* Prominently Displayed Tagline */}
      <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#191919] max-w-4xl mx-auto leading-[1.08]">
        See it. Snap it. <span className="italic font-serif-cormorant font-normal text-[#285C47]">Find it.</span>
      </h1>

      {/* Supporting Copy */}
      <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#77736F] max-w-2xl mx-auto leading-relaxed">
        Point your phone camera at any clothing item you love. ThreadFind computes its visual embedding and reveals the closest matching garments from our searchable catalogue.
      </p>

      {/* Dominant Primary Mobile & Desktop Action Area */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
        {/* Primary CTA: Take a photo */}
        <button
          id="take-photo-btn"
          type="button"
          onClick={onLaunchCamera}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-lg bg-[#285C47] text-white text-base font-semibold hover:bg-[#1F4A39] transition-all shadow-md active:scale-98 group cursor-pointer"
        >
          <Camera className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          <span>Take a photo</span>
        </button>

        {/* Secondary Action: Upload a photo */}
        <button
          id="upload-photo-btn"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-white border border-[#E6E2DC] text-[#191919] text-sm font-medium hover:bg-[#FAF9F6] hover:border-[#CCC7BE] transition-all shadow-xs active:scale-98 cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-[#285C47]" />
          <span>Upload a photo</span>
        </button>

        {/* Tertiary Action: Try a demo */}
        <button
          id="try-demo-btn"
          type="button"
          onClick={onScrollToSamples}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-3.5 rounded-lg bg-[#FAF9F6] border border-transparent text-[#77736F] text-sm font-medium hover:text-[#191919] hover:bg-[#F4F1EA] transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 text-[#285C47]" />
          <span>Try a demo</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Interactive Drop Zone Area */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed p-6 sm:p-10 transition-all duration-300 cursor-pointer bg-white group ${
            isDragging
              ? 'border-[#285C47] bg-[#E8EFE9]/40 scale-[1.01]'
              : 'border-[#E6E2DC] hover:border-[#285C47]/70 hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF9F6] border border-[#E6E2DC] flex items-center justify-center text-[#285C47] group-hover:scale-110 transition-transform shadow-xs">
            <Upload className="w-5 h-5 stroke-[1.8]" />
          </div>

          <h3 className="text-sm font-medium text-[#191919] mb-1">
            Or drag & drop garment photo here
          </h3>
          <p className="text-xs text-[#77736F]">
            Supports JPG, PNG, or WebP up to 15MB
          </p>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-[#9E2A2B] font-medium">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Reassurance & Utility Hints */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77736F] px-2 gap-2">
          <span>Works with camera snapshots, street-style photos, or gallery images.</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#285C47]" />
            <span>Zero permanent image retention · Private session</span>
          </span>
        </div>
      </div>
    </section>
  );
};
