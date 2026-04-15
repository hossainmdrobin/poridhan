'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

interface ZoomState {
  scale: number;
  positionX: number;
  positionY: number;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomState, setZoomState] = useState<ZoomState>({ scale: MIN_ZOOM, positionX: 50, positionY: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
}, []);

  const handleZoomIn = useCallback(() => {
    setZoomState((prev) => ({
      ...prev,
      scale: Math.min(prev.scale + ZOOM_STEP, MAX_ZOOM),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomState((prev) => ({
      ...prev,
      scale: Math.max(prev.scale - ZOOM_STEP, MIN_ZOOM),
    }));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomState({ scale: MIN_ZOOM, positionX: 50, positionY: 50 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    setIsHovering(true);
    setZoomState((prev) => ({ ...prev, scale: 2 }));
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    handleResetZoom();
  }, [handleResetZoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || isMobile || !isHovering) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomState((prev) => ({ ...prev, positionX: x, positionY: y }));
  }, [isMobile, isHovering]);

  const selectedImage = images[selectedIndex] || 'https://images.unsplash.com/photo-1441984904996-eb6ba687e04?w=800';

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={imageContainerRef}
        className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            cursor: isMobile ? 'default' : isHovering ? 'zoom-in' : 'zoom-in',
          }}
        >
          <Image
            src={selectedImage}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover transition-transform duration-200"
            style={{
              transform: zoomState.scale > MIN_ZOOM 
                ? `scale(${zoomState.scale})` 
                : 'scale(1)',
              transformOrigin: zoomState.scale > MIN_ZOOM 
                ? `${zoomState.positionX}% ${zoomState.positionY}%` 
                : 'center center',
            }}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        
        {isMobile && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-4 py-2">
            <button
              onClick={handleZoomOut}
              disabled={zoomState.scale <= MIN_ZOOM}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="min-w-[3rem] text-center text-sm font-medium text-white">
              {Math.round(zoomState.scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomState.scale >= MAX_ZOOM}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 transition hover:bg-neutral-200"
              aria-label="Reset zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {!isMobile && isHovering && zoomState.scale > MIN_ZOOM && (
          <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
            {Math.round(zoomState.scale * 100)}%
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedIndex(index);
                handleResetZoom();
              }}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 ${
                selectedIndex === index
                  ? 'ring-2 ring-neutral-900 ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
