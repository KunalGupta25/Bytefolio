
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
  const [isMounted, setIsMounted] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleScriptLoad = () => {
    console.log("Spline viewer script successfully loaded.");
    setIsScriptLoaded(true);
  };

  const handleScriptError = (e: any) => {
    console.error('Error loading Spline viewer script:', e);
    // Optionally set an error state here to show a fallback UI
  };

  if (!isMounted) {
    // Placeholder during SSR or before client-side mount
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
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {isMounted && isScriptLoaded ? (
          <spline-viewer
            url="https://prod.spline.design/NeMM5nMR9kXUPPhx/scene.splinecode"
            events_target="global"
            style={{ width: '100%', height: '100%', minHeight: '250px' }}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-muted text-muted-foreground rounded-lg overflow-hidden">
            {isMounted && !isScriptLoaded ? "Loading script..." : "Initializing 3D model..."}
          </div>
        )}
      </div>
    </>
  );
};

export default SplineViewerComponent;
