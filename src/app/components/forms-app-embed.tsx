
"use client";

import Script from 'next/script';
import React, { useEffect } from 'react';

// Configuration for your specific forms.app form
const FORMS_APP_ID = "6826fcd8aaa45f0009052b17";
const FORMS_APP_HOST = "https://6f81sl5n.forms.app";
const FORMS_APP_TYPE = 'fullscreen'; 
const FORMS_APP_OPTIONS = { opacity: 0 }; 

const FormsAppEmbed: React.FC = () => {
  useEffect(() => {
    // This effect runs once after the component mounts.
    // We only initialize the form if the script has already loaded and defined window.formsapp
    // The Script component handles loading, and its onLoad will trigger the initialization.
    // This useEffect is more of a safeguard or for re-initialization if needed,
    // but primary initialization is handled by Script's onLoad.
    if (typeof (window as any).formsapp === 'function') {
      // Check if the form has already been initialized to avoid duplicates
      if (!(window as any).formsappInstanceInitialized) {
        try {
          setTimeout(() => { // Defer to next tick
            new (window as any).formsapp(
              FORMS_APP_ID,
              FORMS_APP_TYPE,
              FORMS_APP_OPTIONS,
              FORMS_APP_HOST
            );
            (window as any).formsappInstanceInitialized = true; // Mark as initialized
            console.log(`forms.app (useEffect) initialized for ID: ${FORMS_APP_ID} with type: ${FORMS_APP_TYPE}`);
          }, 0);
        } catch (e) {
          console.error('Error initializing forms.app from useEffect:', e);
        }
      }
    }
  }, []);

  return (
    <>
      {/* This div might still be used by the script as an identifier or for certain non-fullscreen modes */}
      <div id={FORMS_APP_ID} />
      <Script
        src="https://forms.app/cdn/embed.js"
        strategy="lazyOnload" 
        onLoad={() => {
          if (typeof (window as any).formsapp === 'function') {
            // Defer initialization to the next browser tick
            setTimeout(() => {
              try {
                if (!(window as any).formsappInstanceInitialized) { // Prevent re-initialization
                  new (window as any).formsapp(
                    FORMS_APP_ID,
                    FORMS_APP_TYPE,
                    FORMS_APP_OPTIONS,
                    FORMS_APP_HOST
                  );
                  (window as any).formsappInstanceInitialized = true; // Mark as initialized
                  console.log(`forms.app (onLoad) initialized for ID: ${FORMS_APP_ID} with type: ${FORMS_APP_TYPE}`);
                }
              } catch (e) {
                console.error('Error initializing forms.app from onLoad:', e);
              }
            }, 0);
          } else {
            console.error('formsapp function not found on window object after script load.');
          }
        }}
        onError={(e) => {
          console.error('Error loading forms.app embed.js:', e);
        }}
      />
    </>
  );
};

export default FormsAppEmbed;
