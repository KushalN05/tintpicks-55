
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
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTroubleHint, setShowTroubleHint] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Utility to stop the camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setIsStreaming(false);
      videoRef.current.srcObject = null;
    }
  };

  // Effect: start the camera when component mounts or user retries
  useEffect(() => {
    let hintTimer: ReturnType<typeof setTimeout>;
    const startCamera = async () => {
      setShowTroubleHint(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
          setShowTroubleHint(false);
        }
        // Show trouble hint if camera doesn't load after ~2s
        hintTimer = setTimeout(() => {
          if (
            !videoRef.current ||
            videoRef.current.readyState === 0 ||
            !videoRef.current.srcObject
          ) {
            setShowTroubleHint(true);
          }
        }, 2000);
      } catch (error) {
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
      stopCamera();
      if (hintTimer) clearTimeout(hintTimer);
    };
    // note: this effect depends on retryCount, so retry reloads cam
  }, [toast, onClose, retryCount]);

  // Ensure camera is always stopped when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Let user retry starting the camera on demand
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
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        const centerX = canvasRef.current.width / 2;
        const centerY = canvasRef.current.height / 2;
        const pixel = context.getImageData(centerX, centerY, 1, 1).data;
        const hex = `#${pixel[0]
          .toString(16)
          .padStart(2, '0')}${pixel[1]
          .toString(16)
          .padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;

        stopCamera();
        onCapture(hex);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>

        {/* Camera controls */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
          <Button
            className="bg-white text-black hover:bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center"
            onClick={captureColor}
            disabled={!isStreaming}
          >
            <Camera className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="bg-black/20 hover:bg-black/40"
            onClick={handleClose}
          >
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>

        {/* Help: Trouble loading camera? */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center mb-8 space-y-2 pointer-events-auto">
          <span className="text-white/70 text-xs text-center px-4">
            Aim the circle at a color, then tap the camera button to pick it.
          </span>
          {showTroubleHint && (
            <div className="flex flex-col items-center space-y-2 mt-2">
              <span className="text-yellow-200 text-xs text-center">
                Having trouble? If the camera appears black or stuck, you can retry below!
              </span>
              <Button
                size="sm"
                className="flex items-center gap-1 bg-white/80 text-black hover:bg-white font-semibold px-4 py-2 mt-1 rounded-full"
                onClick={handleRetryCamera}
                type="button"
              >
                <RefreshCw className="inline h-4 w-4 mr-1" /> Retry Camera
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorCapture;
