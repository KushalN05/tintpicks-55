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
      <div className="relative flex-1">
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

        {/* Camera controls */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 bg-gradient-to-b from-black/50 to-transparent">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute bottom-24 pb-[env(safe-area-inset-bottom)] left-0 right-0 flex justify-center items-center pointer-events-auto">
          <Button
            className="bg-white text-black hover:bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            onClick={captureColor}
            disabled={!isStreaming}
          >
            <Camera className="h-8 w-8" />
          </Button>
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
