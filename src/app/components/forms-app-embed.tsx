
"use client";

import Script from 'next/script';
import React from 'react';

// Configuration for your specific forms.app form
const FORMS_APP_ID = "6826fcd8aaa45f0009052b17";
const FORMS_APP_HOST = "https://6f81sl5n.forms.app";
const FORMS_APP_TYPE = 'fullscreen'; // Updated embed type
const FORMS_APP_OPTIONS = { opacity: 0 }; // Updated options

const FormsAppEmbed: React.FC = () => {
  return (
    <>
      {/* This div will be targeted by the forms.app script.
          For 'fullscreen' type, explicit width/height styles are typically not needed here
          as the script will manage the fullscreen presentation. */}
      <div id={FORMS_APP_ID} />
      <Script
        src="https://forms.app/cdn/embed.js"
        strategy="lazyOnload" // Loads when the browser is idle
        onLoad={() => {
          if (typeof (window as any).formsapp === 'function') {
            try {
              new (window as any).formsapp(
                FORMS_APP_ID,
                FORMS_APP_TYPE, // Use updated type
                FORMS_APP_OPTIONS, // Use updated options
                FORMS_APP_HOST
              );
              console.log(`forms.app initialized for ID: ${FORMS_APP_ID} with type: ${FORMS_APP_TYPE}`);
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
