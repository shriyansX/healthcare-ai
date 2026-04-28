import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/',        label: 'Dashboard' },
  { href: '/upload',  label: 'Upload' },
  { href: '/extract', label: 'Extract' },
  { href: '/rag',     label: 'RAG' },
  { href: '/results', label: 'Results' },
  { href: '/map',     label: 'Map' },
];

export default function Navbar() {
  const { pathname } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [apiOk, setApiOk] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${base}/health`, { signal: AbortSignal.timeout(3000) })
      .then(r => setApiOk(r.ok))
      .catch(() => setApiOk(false));
  }, []);

  return (
    <nav style={{
      position: 'fixed', inset: '0 0 auto 0', zIndex: 100,
      height: 58,
      background: scrolled ? 'rgba(6,6,15,0.95)' : 'rgba(6,6,15,0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
      display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 32,
      transition: 'all 0.25s ease',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, #4f8ef7, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(79,142,247,0.4)',
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="7" y="2" width="2" height="12" rx="1" fill="white"/>
            <rect x="2" y="7" width="12" height="2" rx="1" fill="white"/>
          </svg>
        </div>
        <span style={{
          fontFamily: 'Space Grotesk, Inter, sans-serif',
          fontWeight: 700, fontSize: 15,
          background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.01em',
        }}>HealthcareAI</span>
      </Link>

      {/* Nav */}
      <div style={{ display: 'flex', gap: 2, flex: 1, alignItems: 'center' }}>
        {NAV.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              padding: '6px 12px',
              borderRadius: 7,
              fontSize: 13.5,
              fontWeight: active ? 600 : 400,
              color: active ? '#f1f5f9' : 'var(--t3)',
              background: active ? 'rgba(79,142,247,0.12)' : 'transparent',
              border: active ? '1px solid rgba(79,142,247,0.22)' : '1px solid transparent',
              transition: 'all 0.15s',
              letterSpacing: '-0.01em',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color='var(--t2)'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color='var(--t3)'; e.currentTarget.style.background='transparent'; }}}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '5px 12px',
        background: apiOk === true ? 'rgba(16,185,129,0.08)' : apiOk === false ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${apiOk === true ? 'rgba(16,185,129,0.20)' : apiOk === false ? 'rgba(239,68,68,0.20)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 999,
        fontSize: 12, fontWeight: 600,
        color: apiOk === true ? '#6ee7b7' : apiOk === false ? '#fca5a5' : 'var(--t3)',
        flexShrink: 0, transition: 'all 0.3s',
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
          background: apiOk === true ? '#10b981' : apiOk === false ? '#ef4444' : '#475569',
          boxShadow: apiOk === true ? '0 0 8px #10b981' : 'none',
        }} />
        {apiOk === true ? 'API Live' : apiOk === false ? 'API Offline' : 'Connecting'}
      </div>
    </nav>
  );
}
