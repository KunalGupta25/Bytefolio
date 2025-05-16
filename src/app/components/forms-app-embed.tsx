
"use client";

import Script from 'next/script';
import React from 'react';

// Configuration for your specific forms.app form
const FORMS_APP_ID = "6826fcd8aaa45f0009052b17";
const FORMS_APP_HOST = "https://6f81sl5n.forms.app";
const FORMS_APP_OPTIONS = { width: '100%', height: '600px', opacity: 0 }; 
// Note: Original width was '50vw'. Changed to '100%' to better fit within the card layout.
// If '50vw' is strictly needed, this can be reverted.

const FormsAppEmbed: React.FC = () => {
  return (
    <>
      {/* This div will be targeted by the forms.app script using its ID */}
      <div id={FORMS_APP_ID} style={{ width: FORMS_APP_OPTIONS.width, height: FORMS_APP_OPTIONS.height }} />
      <Script
        src="https://forms.app/cdn/embed.js"
        strategy="lazyOnload" // Loads when the browser is idle
        onLoad={() => {
          if (typeof (window as any).formsapp === 'function') {
            try {
              new (window as any).formsapp(
                FORMS_APP_ID,
                'standard', // Type of embed
                FORMS_APP_OPTIONS, // Options
                FORMS_APP_HOST // Host
              );
              console.log('forms.app initialized for ID:', FORMS_APP_ID);
            } catch (e) {
              console.error('Error initializing forms.app:', e);
            }
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
