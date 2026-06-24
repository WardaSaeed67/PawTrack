"use client";

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function Dashboard({ htmlContent }) {
  useEffect(() => {
    window.handleLogout = () => {
      localStorage.removeItem('pawtrack_data');
      signOut();
    };

    if (window.__pawtrack_initialized) {
      console.log("PawTrack is already initialized.");
      return;
    }
    window.__pawtrack_initialized = true;

    import('../app.js')
      .then((module) => {
        console.log("PawTrack client logic (app.js) loaded successfully.");
      })
      .catch((err) => {
        console.error("Failed to dynamically import app.js:", err);
      });
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
