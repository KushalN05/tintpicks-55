import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Check, RotateCcw, Upload, Image as ImageIcon } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string, imageBlob?: Blob) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stop all active tracks on the stream
  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track:', e);
        }
      });
      setStream(null);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopStream();
      setCapturedImage(null);
      setCapturedBlob(null);
      setCameraError(null);
      return;
    }

    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    const startCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API (getUserMedia) is not supported in this browser environment or requires HTTPS/localhost.');
        }

        // Try ideal rear-facing camera first, fallback if unavailable
        let mediaStream: MediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1920, min: 640 },
              height: { ideal: 1080, min: 480 },
            },
            audio: false,
          });
        } catch (initialErr) {
          // Fallback to any available video stream
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (isCancelled) {
          mediaStream.getTracks().forEach(t => t.stop());
          return;
        }

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(playErr => {
            console.warn('Video play error:', playErr);
          });
        }
      } catch (err: any) {
        if (isCancelled) return;
        console.warn('Camera stream error:', err);
        const isPermissionDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
        setCameraError(
          isPermissionDenied
            ? 'Camera permission was denied. Please allow camera access in your browser settings, or upload an existing photo from your gallery below.'
            : (err.message || 'Unable to access your device camera. Please check camera permissions or upload an image.')
        );
      }
    };

    startCamera();

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // Handle snap photo: freeze frame to canvas & state
  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);

    // Convert to JPEG Blob
    canvas.toBlob(blob => {
      if (blob) {
        setCapturedBlob(blob);
      }
    }, 'image/jpeg', 0.92);
  };

  // Retake photo: discard captured state, resume camera preview
  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedBlob(null);
    if (videoRef.current && stream) {
      videoRef.current.play().catch(console.warn);
    }
  };

  // Accept photo: complete capture, stop camera stream, pass image bytes
  const handleAccept = () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    stopStream();
    onCapture(capturedImage, capturedBlob || undefined);
    setIsProcessing(false);
  };

  // Cancel and close
  const handleCancel = () => {
    stopStream();
    setCapturedImage(null);
    setCapturedBlob(null);
    onClose();
  };

  // Upload fallback from file/gallery
  const handleGalleryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        stopStream();
        onCapture(event.target.result as string, file);
      }
    };
    reader.readAsDataURL(file);
  };

  // Demo fallback snapshot
  const handleSimulateSnapshot = () => {
    stopStream();
    onCapture('/samples/leather-jacket.jpg');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#191919] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[95vh]">
        {/* Hidden gallery file input */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleGalleryFile}
        />

        {/* Header */}
        <div className="p-4 flex items-center justify-between text-white border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-[#285C47]" />
            <span className="text-sm font-semibold tracking-wide">
              {capturedImage ? 'Review Photograph' : 'Point Camera at Garment'}
            </span>
          </div>
          <button
            id="camera-cancel-btn"
            type="button"
            onClick={handleCancel}
            className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cancel and close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport / Live Stream / Frozen Preview */}
        <div className="relative aspect-[4/3] sm:aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            /* Freeze-frame preview after snapping */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured garment"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-[#285C47] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Photo Captured</span>
              </div>
            </div>
          ) : cameraError ? (
            /* Error & Fallback UI */
            <div className="p-6 text-center text-white/90 max-w-sm">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h4 className="text-base font-semibold mb-2 text-white">Camera Unavailable</h4>
              <p className="text-xs text-white/70 mb-5 leading-relaxed">{cameraError}</p>
              <div className="space-y-2.5">
                <button
                  id="camera-fallback-gallery-btn"
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39] flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload from Gallery instead</span>
                </button>
                <button
                  id="camera-demo-snapshot-btn"
                  type="button"
                  onClick={handleSimulateSnapshot}
                  className="w-full py-2 px-4 rounded-md bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Try with Sample Streetwear Photo
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Stream */
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder crosshairs / focus box */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-white/50 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="text-center px-4 py-2 bg-black/40 backdrop-blur-xs rounded-full border border-white/20">
                  <span className="text-[11px] text-white/90 font-medium">
                    Centre the clothing item in frame
                  </span>
                </div>
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Section: Live Capture vs Retake / Accept */}
        <div className="p-4 sm:p-5 bg-[#191919] border-t border-white/10">
          {capturedImage ? (
            /* Step: Retake, Accept, or Cancel */
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                id="camera-retake-btn"
                type="button"
                onClick={handleRetake}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-md bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-all border border-white/15 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-white/80" />
                <span>Retake Photograph</span>
              </button>

              <button
                id="camera-accept-btn"
                type="button"
                onClick={handleAccept}
                disabled={isProcessing}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 py-3 px-5 rounded-md bg-[#285C47] text-white text-xs font-semibold hover:bg-[#1F4A39] transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Accept & Search Products</span>
              </button>
            </div>
          ) : (
            /* Step: Live camera actions (Flip, Shutter, Gallery fallback) */
            <div className="flex items-center justify-between px-2">
              {/* Flip camera (front/back) */}
              <button
                id="camera-flip-btn"
                type="button"
                onClick={() => setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Switch camera facing mode"
                aria-label="Switch camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Shutter Button */}
              <button
                id="camera-shutter-btn"
                type="button"
                onClick={cameraError ? () => galleryInputRef.current?.click() : handleTakePhoto}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 group active:scale-95 transition-transform shadow-lg cursor-pointer"
                aria-label="Capture clothing item"
              >
                <div className="w-full h-full rounded-full bg-[#285C47] group-hover:bg-[#1F4A39] transition-colors flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>

              {/* Gallery fallback */}
              <button
                id="camera-gallery-btn"
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center space-x-1 cursor-pointer"
                title="Upload from device gallery"
                aria-label="Upload photo from device gallery"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
