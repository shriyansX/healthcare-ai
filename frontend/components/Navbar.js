import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { href: '/',         label: '📊 Dashboard' },
  { href: '/upload',   label: '📁 Upload' },
  { href: '/extract',  label: '🤖 AI Extract' },
  { href: '/rag',      label: '🔍 RAG Engine' },
  { href: '/results',  label: '📋 Results' },
  { href: '/map',      label: '🗺 Map' },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(10,14,26,0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e293b',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '2rem' }}>
        <span style={{ fontSize: '1.4rem' }}>🏥</span>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg,#3b82f6,#14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          HealthcareAI
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: router.pathname === l.href ? '#3b82f6' : '#94a3b8',
            background: router.pathname === l.href ? 'rgba(59,130,246,0.12)' : 'transparent',
            border: router.pathname === l.href ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
            transition: 'all 0.2s',
          }}>
            {l.label}
          </Link>
        ))}
      </div>
      <div style={{
        background: 'rgba(34,197,94,0.15)',
        border: '1px solid rgba(34,197,94,0.3)',
        borderRadius: '999px',
        padding: '0.3rem 0.9rem',
        fontSize: '0.78rem',
        color: '#22c55e',
        fontWeight: 600,
      }}>
        ● API Online
      </div>
    </nav>
  );
}
