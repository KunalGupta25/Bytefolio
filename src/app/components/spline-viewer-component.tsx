
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
        strategy="lazyOnload" 
        onLoad={() => {
          console.log("Spline viewer script successfully loaded.");
        }}
        onError={(e) => {
          console.error('Error loading Spline viewer script:', e);
        }}
      />
      {/* Ensure this div takes up the full space of its parent container in AboutSection */}
      <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {/* The spline-viewer custom element will be processed by the script loaded above. */}
        <spline-viewer
          url="https://prod.spline.design/NeMM5nMR9kXUPPhx/scene.splinecode"
          events_target="global" 
          style={{ width: '100%', height: '100%', minHeight: '250px' }} // minHeight to ensure it has some dimension
        />
      </div>
    </>
  );
};

export default SplineViewerComponent;
