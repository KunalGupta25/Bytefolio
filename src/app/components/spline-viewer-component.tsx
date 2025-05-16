
"use client";

import Script from 'next/script';
import React, { useEffect, useState } from 'react';

// Extend JSX.IntrinsicElements to include spline-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { 
        url: string; 
        events_target?: string;
      }, HTMLElement>;
    }
  }
}

const SplineViewerComponent: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [canRenderSpline, setCanRenderSpline] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isScriptLoaded) {
      // Add a minimal delay to ensure the Spline script has fully initialized
      const timer = setTimeout(() => {
        if (typeof (window as any).Spline === 'function' || window.customElements.get('spline-viewer')) {
          setCanRenderSpline(true);
        } else {
          // Fallback if Spline or custom element isn't ready after a short delay
          // This might indicate a deeper issue with the Spline script or scene
          console.warn("Spline viewer custom element still not defined after delay.");
          setCanRenderSpline(true); // Attempt to render anyway, or handle error
        }
      }, 100); // 100ms delay, can be adjusted

      return () => clearTimeout(timer);
    }
  }, [isClient, isScriptLoaded]);

  if (!isClient) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-muted text-muted-foreground rounded-lg overflow-hidden">
        Loading 3D model...
      </div>
    );
  }

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.9.94/build/spline-viewer.js"
        strategy="lazyOnload" 
        onLoad={() => {
          console.log("Spline viewer script successfully loaded.");
          setIsScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('Error loading Spline viewer script:', e);
          // Potentially set an error state here to show a fallback UI
        }}
      />
      <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {canRenderSpline ? (
          <spline-viewer
            url="https://prod.spline.design/NeMM5nMR9kXUPPhx/scene.splinecode"
            events_target="global" 
            style={{ width: '100%', height: '100%', minHeight: '250px' }}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-muted text-muted-foreground rounded-lg overflow-hidden">
            Initializing 3D model...
          </div>
        )}
      </div>
    </>
  );
};

export default SplineViewerComponent;
