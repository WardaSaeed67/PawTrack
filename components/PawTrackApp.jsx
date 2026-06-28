'use client';

import { useEffect, useRef } from 'react';

/**
 * PawTrackApp — Client Component (Optimized for <2s load)
 *
 * Renders the HTML immediately via dangerouslySetInnerHTML (no loading screen).
 * Imports app.js immediately after mount without setTimeout delay.
 */
export default function PawTrackApp({ htmlContent }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Import app.js immediately — DOM is already rendered by dangerouslySetInnerHTML
    import(/* webpackIgnore: true */ '/app.js').catch((err) => {
      console.error('[PawTrack] Failed to load app.js:', err);
    });
  }, []);

  // Render the HTML immediately — no loading screen, no delay
  return (
    <div
      id="pawtrack-root"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
