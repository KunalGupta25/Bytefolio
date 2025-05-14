
"use client";

import Script from 'next/script';
import React, { useEffect, useState } from 'react';

// Extend JSX.IntrinsicElements to include spline-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url: string; events_target?: string; }, HTMLElement>;
    }
  }
}

const SplineViewerComponent: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.9.94/build/spline-viewer.js"
        strategy="lazyOnload" 
        onLoad={() => {
          // Potentially re-check or force re-render if needed, though useState should handle it.
          // console.log('Spline viewer script loaded.');
        }}
        onError={(e) => {
          console.error('Error loading Spline viewer script:', e);
        }}
      />
      <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {/* Only render spline-viewer if the component is mounted (client-side) */}
        {isMounted ? (
          <spline-viewer 
            url="https://prod.spline.design/NeMM5nMR9kXUPPhx/scene.splinecode"
            style={{ width: '100%', height: '100%', minHeight: '300px' }} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            Loading 3D viewer...
          </div>
        )}
      </div>
    </>
  );
};

export default SplineViewerComponent;
