
"use client";

import Script from 'next/script';
import React from 'react';

// Extend JSX.IntrinsicElements to include spline-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url: string; events_target?: string; }, HTMLElement>;
    }
  }
}

const SplineViewerComponent: React.FC = () => {
  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.9.94/build/spline-viewer.js"
        strategy="lazyOnload" // Or "afterInteractive" if it needs to load sooner
      />
      <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {/* The spline-viewer tag will be rendered once the script loads */}
        {/* You might need to adjust styling/sizing for the spline-viewer element itself */}
        <spline-viewer 
          url="https://prod.spline.design/NeMM5nMR9kXUPPhx/scene.splinecode"
          style={{ width: '100%', height: '100%', minHeight: '300px' }} // Ensure it takes up space
        />
      </div>
    </>
  );
};

export default SplineViewerComponent;
