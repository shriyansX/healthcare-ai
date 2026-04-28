import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const links = [
  { href: '/',        label: 'Dashboard', icon: '📊' },
  { href: '/upload',  label: 'Upload',    icon: '📁' },
  { href: '/extract', label: 'AI Extract',icon: '🤖' },
  { href: '/rag',     label: 'RAG Engine',icon: '🔍' },
  { href: '/results', label: 'Results',   icon: '📋' },
  { href: '/map',     label: 'Map',       icon: '🗺' },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiBase}/health`, { signal: AbortSignal.timeout(3000) })
      .then(r => setApiStatus(r.ok ? 'online' : 'error'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const statusColor = { online: '#22c55e', offline: '#ef4444', checking: '#f59e0b', error: '#ef4444' };
  const statusLabel = { online: 'API Online', offline: 'API Offline', checking: 'Connecting…', error: 'API Error' };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(5,9,18,0.97)' : 'rgba(5,9,18,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(30,41,59,0.9)' : 'rgba(30,41,59,0.4)'}`,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        gap: '1.5rem',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #14b8a6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', boxShadow: '0 0 16px rgba(59,130,246,0.3)',
          }}>🏥</div>
          <span style={{
            fontWeight: 800, fontSize: '1.05rem',
            background: 'linear-gradient(135deg,#3b82f6,#14b8a6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.01em',
          }}>HealthcareAI</span>
        </Link>

        {/* Nav Links — desktop */}
        <div style={{ display: 'flex', gap: '0.2rem', flex: 1, alignItems: 'center' }} className="nav-links">
          {links.map(l => {
            const active = router.pathname === l.href;
            return (
              <Link key={l.href} href={l.href} style={{
                padding: '0.42rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: active ? 700 : 500,
                color: active ? '#60a5fa' : '#94a3b8',
                background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
                border: active ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                transition: 'all 0.18s ease',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color='#cbd5e1'; e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='transparent'; }}}
              >
                <span style={{ fontSize: '0.85rem' }}>{l.icon}</span> {l.label}
              </Link>
            );
          })}
        </div>

        {/* API status pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.45rem',
          background: `${statusColor[apiStatus]}14`,
          border: `1px solid ${statusColor[apiStatus]}40`,
          borderRadius: '999px',
          padding: '0.28rem 0.85rem',
          fontSize: '0.74rem',
          color: statusColor[apiStatus],
          fontWeight: 700,
          flexShrink: 0,
          transition: 'all 0.3s',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: statusColor[apiStatus],
            animation: apiStatus === 'online' ? 'pulse-dot 2s ease-in-out infinite' : 'none',
          }} />
          {statusLabel[apiStatus]}
        </div>
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none; }
        }
      `}</style>
    </>
  );
}
