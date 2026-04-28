import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head><title>404 — HealthcareAI</title></Head>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem',
      }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 72, fontWeight: 700, color: 'var(--bg-3)', lineHeight: 1, marginBottom: 16 }}>
          404
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)', marginBottom: 8 }}>Page not found</div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 24 }}>
          This page doesn't exist in the healthcare network.
        </div>
        <Link href="/" className="btn btn-ghost">← Back to Dashboard</Link>
      </div>
    </>
  );
}
