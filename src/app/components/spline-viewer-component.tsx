
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
        // The 'loading' attribute (e.g., 'lazy') is part of the spline-viewer's own API,
        // separate from next/script strategy.
        // We'll rely on next/script's strategy for script loading.
      }, HTMLElement>;
    }
  }
}

const SplineViewerComponent: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This ensures the component only attempts to render its content on the client-side
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or null on the server and during initial client-side render
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-muted text-muted-foreground rounded-lg overflow-hidden">
        Loading 3D model...
      </div>
    );
  }

  // Once mounted on the client, render the script and the spline-viewer element
  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.9.94/build/spline-viewer.js"
        strategy="lazyOnload" // Loads the script when the browser is idle
        onLoad={() => {
          console.log("Spline viewer script successfully loaded via next/script.");
          // At this point, the <spline-viewer> custom element should be defined.
        }}
        onError={(e) => {
          console.error('Error loading Spline viewer script via next/script:', e);
        }}
      />
      <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {/* The spline-viewer custom element will be processed by the script loaded above. */}
        <spline-viewer
          url="https://prod.spline.design/NeMM5nMR9kXUPPhx/scene.splinecode"
          events_target="global" // Recommended for broader event handling
          style={{ width: '100%', height: '100%', minHeight: '250px' }}
          // The 'loading' attribute on the element itself can also be set to 'lazy'
          // if supported by the spline-viewer element, e.g., loading="lazy"
        />
      </div>
    </>
  );
};

export default SplineViewerComponent;
