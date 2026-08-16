import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ColorCapture = ({
  onCapture,
  onClose,
}: {
  onCapture: (color: string) => void;
  onClose: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTroubleHint, setShowTroubleHint] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    let isMounted = true;
    let hintTimer: ReturnType<typeof setTimeout>;
    const startCamera = async () => {
      setShowTroubleHint(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
          setShowTroubleHint(false);
        }
        
        hintTimer = setTimeout(() => {
          if (
            isMounted && 
            (!videoRef.current ||
            videoRef.current.readyState === 0 ||
            !videoRef.current.srcObject)
          ) {
            setShowTroubleHint(true);
          }
        }, 2000);
      } catch (error) {
        if (!isMounted) return;
        toast({
          title: 'Camera Error',
          description: 'Unable to access camera. Please check permissions.',
          variant: 'destructive',
        });
        setShowTroubleHint(true);
        onClose();
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      stopCamera();
      if (hintTimer) clearTimeout(hintTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleRetryCamera = () => {
    stopCamera();
    setRetryCount((n) => n + 1);
    setIsStreaming(false);
    setShowTroubleHint(false);
  };

  const captureColor = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        let vWidth = videoRef.current.videoWidth;
        let vHeight = videoRef.current.videoHeight;
        
        // Fallback for iOS Safari where videoWidth might not be immediately available
        if (!vWidth || !vHeight) {
          vWidth = videoRef.current.clientWidth || 300;
          vHeight = videoRef.current.clientHeight || 400;
        }

        canvasRef.current.width = vWidth;
        canvasRef.current.height = vHeight;
        context.drawImage(videoRef.current, 0, 0, vWidth, vHeight);

        const centerX = Math.floor(vWidth / 2);
        const centerY = Math.floor(vHeight / 2);
        
        try {
          const pixel = context.getImageData(centerX, centerY, 1, 1).data;
          const hex = `#${pixel[0]
            .toString(16)
            .padStart(2, '0')}${pixel[1]
            .toString(16)
            .padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`.toUpperCase();

          stopCamera();
          onCapture(hex);
        } catch (err) {
          console.error("Failed to capture image data", err);
          toast({
            title: 'Capture Failed',
            description: 'Could not capture color. Try again.',
            variant: 'destructive',
          });
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50 animate-fade-in">
      {/* Container with onClick to capture anywhere on screen */}
      <div className="relative flex-1" onClick={captureColor}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Minimalist Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 border border-white/50 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_rgba(0,0,0,0.5)]" />
          </div>
        </div>

        {/* Close Button - Top Right */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 text-white hover:bg-black/70 hover:text-white rounded-full p-2 w-10 h-10"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Shutter Button - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <button
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/80 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              captureColor();
            }}
            disabled={!isStreaming}
          >
            <div className="w-full h-full bg-white rounded-full active:scale-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Help: Trouble loading camera? */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center space-y-2 pointer-events-auto">
          {showTroubleHint && (
            <div className="flex flex-col items-center space-y-2 mt-2 bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm">
              <span className="text-white/90 text-xs text-center">
                Having trouble?
              </span>
              <Button
                size="sm"
                variant="secondary"
                className="flex items-center gap-1 rounded-full h-8 text-xs font-medium"
                onClick={handleRetryCamera}
                type="button"
              >
                <RefreshCw className="inline h-3 w-3 mr-1" /> Retry Camera
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorCapture;
