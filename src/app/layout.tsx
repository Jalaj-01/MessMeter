"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* PWA Primary Meta Tags */}
        <meta name="application-name" content="IIITG Mess Meter" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mess Meter" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" /> 

        {/* Icons for PWA and iOS */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Your Existing Meta Tags */}
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
        
        {/* Viewport for Mobile Feel */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="bg-slate-50 min-h-screen">
        <AuthProvider>
          <main className="max-w-md mx-auto min-h-screen flex flex-col pb-24">
            <Navbar />
            <div className="flex-grow">
              {mounted ? children : null}
            </div>
            <footer className="py-10 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    © 2026 JG. All rights reserved.
                </p>
            </footer>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}