'use client';

import { useState, useEffect } from 'react';

/**
 * PawTrackApp — Client Component
 *
 * Receives the full HTML body (from index.html) as a prop from the Server Component.
 * After mount:
 *  1. Inserts the HTML into the DOM via dangerouslySetInnerHTML
 *  2. Dynamically imports app.js (which attaches all event listeners and initializes data)
 *
 * Using dangerouslySetInnerHTML preserves the exact HTML structure that app.js expects,
 * avoiding any risk of JSX-conversion errors across 1145 lines of HTML.
 */
export default function PawTrackApp({ htmlContent }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Guard: only initialize once
    if (window.__PAWTRACK_INITIALIZED__) return;
    window.__PAWTRACK_INITIALIZED__ = true;

    setMounted(true);

    // Dynamically import the app logic AFTER the DOM has the HTML
    // Small timeout ensures dangerouslySetInnerHTML DOM update is flushed
    setTimeout(() => {
      import('/app.js').catch((err) => {
        console.error('[PawTrack] Failed to load app.js:', err);
      });
    }, 0);
  }, []);

  if (!mounted) {
    // Show a minimal loading state on first render (server + before mount)
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Nunito, sans-serif',
        fontSize: '1.2rem',
        color: '#C0392B',
        background: '#FFF0F0',
      }}>
        🐾 Loading PawTrack...
      </div>
    );
  }

  return (
    <div
      id="pawtrack-root"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
