import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 — Page Not Found | Healthcare AI</title>
      </Head>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏥</div>
        <h1 style={{
          fontSize: '5rem', fontWeight: 800, margin: 0,
          background: 'linear-gradient(135deg,#3b82f6,#14b8a6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>404</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '1rem 0 2rem' }}>
          This page could not be found in our healthcare network.
        </p>
        <Link href="/" className="btn btn-primary">← Back to Dashboard</Link>
      </div>
    </>
  );
}
