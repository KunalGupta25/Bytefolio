
"use client";

import Script from 'next/script';
import React, { useEffect, useState } from 'react';

// Extend JSX.IntrinsicElements to include spline-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url: string; loading?: string; }, HTMLElement>;
    }
  }
}

const SplineViewerComponent: React.FC = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [readyToRenderSpline, setReadyToRenderSpline] = useState(false);

  useEffect(() => {
    setIsComponentMounted(true);
  }, []);

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  useEffect(() => {
    if (isComponentMounted && isScriptLoaded) {
      const timer = setTimeout(() => {
        setReadyToRenderSpline(true);
      }, 100); // Small delay to ensure Spline script is fully initialized

      return () => clearTimeout(timer);
    }
  }, [isComponentMounted, isScriptLoaded]);

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.9.94/build/spline-viewer.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
        onError={(e) => {
          console.error('Error loading Spline viewer script:', e);
        }}
      />
      {/* Add relative positioning to the container */}
      <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {readyToRenderSpline ? (
          <spline-viewer
            url="https://prod.spline.design/NeMM5nMR9kXUPPhx/scene.splinecode"
            // Adjust minHeight to be less than or equal to the smallest potential container height
            style={{ width: '100%', height: '100%', minHeight: '250px' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            Loading 3D model...
          </div>
        )}
      </div>
    </>
  );
};

export default SplineViewerComponent;
