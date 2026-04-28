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
  const [api, setApi] = useState('—');

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${base}/health`, { signal: AbortSignal.timeout(3000) })
      .then(r => setApi(r.ok ? 'online' : 'error'))
      .catch(() => setApi('offline'));
  }, []);

  return (
    <nav style={{
      position: 'fixed', inset: '0 0 auto 0', zIndex: 100,
      height: 52,
      background: 'rgba(10,10,15,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 32,
    }}>
      {/* Brand */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{
          width: 24, height: 24, borderRadius: 6,
          background: 'var(--blue)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: '#fff', fontWeight: 700,
        }}>H</span>
        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--t1)', letterSpacing: '-0.01em' }}>
          HealthcareAI
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {NAV.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: active ? 500 : 400,
              color: active ? 'var(--t1)' : 'var(--t3)',
              background: active ? 'var(--bg-2)' : 'transparent',
              transition: 'all 0.12s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--t2)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--t3)'; }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* API status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'var(--t3)', flexShrink: 0,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: api === 'online' ? 'var(--green)' : api === '—' ? 'var(--t3)' : 'var(--amber)',
        }} />
        API {api}
      </div>
    </nav>
  );
}
