import React, { useEffect } from 'react';
import { Camera, Image as ImageIcon, Folder } from 'lucide-react';

interface UploadActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectLibrary?: () => void;
  onSelectFile?: () => void;
}

const UploadActionSheet: React.FC<UploadActionSheetProps> = ({
  isOpen,
  onClose,
  onSelectCamera,
  onSelectLibrary,
  onSelectFile,
}) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Bottom Sheet Container */}
      <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-[32px] p-6 z-50 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-bottom-full duration-300 ease-out">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Options */}
        <div className="flex flex-col">
          <button 
            onClick={() => { onClose(); onSelectCamera(); }}
            className="flex items-center gap-4 w-full py-4 text-lg font-medium border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors"
          >
            <Camera className="w-6 h-6 text-gray-500" />
            <span className="text-gray-900">Camera</span>
          </button>
          
          <button 
            onClick={() => { onClose(); onSelectLibrary?.(); }}
            className="flex items-center gap-4 w-full py-4 text-lg font-medium border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors"
          >
            <ImageIcon className="w-6 h-6 text-gray-500" />
            <span className="text-gray-900">Photo Library</span>
          </button>
          
          <button 
            onClick={() => { onClose(); onSelectFile?.(); }}
            className="flex items-center gap-4 w-full py-4 text-lg font-medium border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors"
          >
            <Folder className="w-6 h-6 text-gray-500" />
            <span className="text-gray-900">Choose File</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadActionSheet;
