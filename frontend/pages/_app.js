import Head from 'next/head';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const handleDemoMode = () => setIsDemoMode(true);
    window.addEventListener('demoModeActivated', handleDemoMode);
    return () => window.removeEventListener('demoModeActivated', handleDemoMode);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#06060f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%234f8ef7'/><stop offset='1' stop-color='%2306b6d4'/></linearGradient></defs><rect width='32' height='32' rx='8' fill='url(%23g)'/><rect x='14' y='6' width='4' height='20' rx='2' fill='white'/><rect x='6' y='14' width='20' height='4' rx='2' fill='white'/></svg>" />
      </Head>
      {isDemoMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 30,
          background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
          color: 'white', textAlign: 'center',
          fontSize: 12.5, fontWeight: 600, letterSpacing: '0.02em',
          boxShadow: '0 2px 8px rgba(239,68,68,0.2)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8
        }}>
          <span style={{ fontSize: 14 }}>⚡</span>
          Smart Demo Mode Enabled – ensuring uninterrupted analysis
        </div>
      )}
      <Navbar isDemoMode={isDemoMode} />
      <main style={{ paddingTop: isDemoMode ? 88 : 58, minHeight: '100vh', transition: 'padding-top 0.3s' }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
