import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  big_description: string;
  centerType: string;
  appointmentType: string;
  language: string;
  audioFile: string;
  image: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  big_description,
  centerType,
  appointmentType,
  language,
  audioFile,
  image,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; 
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Use createPortal to render the modal at the document body level
  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999]" 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-3xl max-h-[85vh] overflow-hidden z-[10000]"
        style={{ position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-76px)]">
          <div className="p-6">
            {/* Image */}
            <div className="relative h-64 w-full mb-6 rounded-2xl overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{big_description}</p>
            </div>

            {/* Audio Player */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Audio Preview</h3>
              <div className="bg-gray-50 rounded-xl p-5">
                {/* Native HTML5 Audio Element with Controls */}
                <audio 
                  src={audioFile}
                  controls
                  controlsList="nodownload noplaybackrate"
                  className="w-full outline-none"
                  preload="auto"
                >
                  Your browser does not support the audio element.
                </audio>
                
                {/* MP3 Info */}
                <p className="text-xs text-gray-400 text-center mt-3">Audio format: MP3</p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {centerType}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {appointmentType}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {language === 'fr' ? 'Français' : 'English'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document body level
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
} 