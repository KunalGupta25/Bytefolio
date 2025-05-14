
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

  useEffect(() => {
    // This effect runs once after the component mounts on the client-side
    setIsComponentMounted(true);
  }, []);

  const handleScriptLoad = () => {
    // This callback runs when the Spline viewer script has successfully loaded
    setIsScriptLoaded(true);
  };

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.9.94/build/spline-viewer.js"
        strategy="lazyOnload" // Load the script after other resources, non-blocking
        onLoad={handleScriptLoad} // Set state once the script is loaded
        onError={(e) => {
          console.error('Error loading Spline viewer script:', e);
        }}
      />
      <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {/* Render Spline viewer only if component is mounted AND script is loaded */}
        {isComponentMounted && isScriptLoaded ? (
          <spline-viewer
            url="https://prod.spline.design/NeMM5nMR9kXUPPhx/scene.splinecode"
            style={{ width: '100%', height: '100%', minHeight: '300px' }}
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
