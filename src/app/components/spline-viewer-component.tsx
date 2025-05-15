
"use client";

import Script from 'next/script';
import React, { useEffect, useState } from 'react';

// Extend JSX.IntrinsicElements to include spline-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url: string; loading?: string; events_target?: string }, HTMLElement>;
    }
  }
}

const SplineViewerComponent: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [readyToRenderSpline, setReadyToRenderSpline] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScriptLoad = () => {
    console.log('Spline script loaded.');
    setIsScriptLoaded(true);
  };

  useEffect(() => {
    if (isClient && isScriptLoaded) {
      // Check if the custom element is defined
      if (window.customElements && window.customElements.get('spline-viewer')) {
        console.log('spline-viewer custom element is defined.');
        setReadyToRenderSpline(true);
      } else {
        // It might take a moment for the custom element to be defined after script load
        // We can add a small delay or a poller here if needed, but often just checking
        // in a subsequent effect is enough.
        const checkInterval = setInterval(() => {
          if (window.customElements && window.customElements.get('spline-viewer')) {
            console.log('spline-viewer custom element defined after polling.');
            setReadyToRenderSpline(true);
            clearInterval(checkInterval);
          }
        }, 100);
        // Clear interval after a timeout to prevent infinite loop if element never defines
        const timeoutId = setTimeout(() => {
          clearInterval(checkInterval);
          if (! (window.customElements && window.customElements.get('spline-viewer'))) {
            console.error('Spline-viewer custom element not defined after timeout.');
          }
        }, 2000); // Wait up to 2 seconds

        return () => {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
        };
      }
    }
  }, [isClient, isScriptLoaded]);

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
      <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {isClient && readyToRenderSpline ? (
          <spline-viewer
            url="https://prod.spline.design/NeMM5nMR9kXUPPhx/scene.splinecode"
            events_target="global" // Recommended for broader event handling
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
