import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      return;
    }

    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API is not supported in this browser environment.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false,
        });

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } catch (err: any) {
        console.warn('Camera stream error:', err);
        setCameraError(
          err.message || 'Unable to access your device camera. Please check camera permissions.'
        );
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onCapture(dataUrl);
    }
  };

  const handleSimulateSnapshot = () => {
    // Demo fallback snapshot
    onCapture('/samples/leather-jacket.jpg');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#191919] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between text-white border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-[#285C47]" />
            <span className="text-sm font-semibold">Snap a Garment</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center text-white/80 max-w-xs">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold mb-1 text-white">Camera Permission Needed</h4>
              <p className="text-xs text-white/70 mb-4">{cameraError}</p>
              <button
                type="button"
                onClick={handleSimulateSnapshot}
                className="px-4 py-2 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39]"
              >
                Use Demo Street-Style Snapshot
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder crosshairs */}
              <div className="absolute inset-12 border-2 border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-8 h-8 border border-white/80 rounded-full" />
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="p-6 bg-[#191919] border-t border-white/10 flex items-center justify-around">
          <button
            type="button"
            onClick={() => setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            title="Switch camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Shutter Button */}
          <button
            type="button"
            onClick={cameraError ? handleSimulateSnapshot : handleTakePhoto}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 group active:scale-95 transition-transform"
            aria-label="Capture garment"
          >
            <div className="w-full h-full rounded-full bg-[#285C47] group-hover:bg-[#1F4A39] transition-colors" />
          </button>

          <button
            type="button"
            onClick={handleSimulateSnapshot}
            className="text-xs text-white/70 hover:text-white underline"
          >
            Sample
          </button>
        </div>
      </div>
    </div>
  );
};
