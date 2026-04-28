import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head><title>404 — HealthcareAI</title></Head>
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', minHeight:'80vh', textAlign:'center', padding:'2rem',
        position:'relative',
      }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse at 50% 50%, rgba(79,142,247,0.06) 0%, transparent 60%)',
        }} />
        <div style={{
          fontFamily:'Space Grotesk, Inter, sans-serif',
          fontSize:120, fontWeight:900, letterSpacing:'-0.06em', lineHeight:1,
          background:'linear-gradient(135deg, rgba(79,142,247,0.3), rgba(6,182,212,0.2))',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          marginBottom:16,
        }}>404</div>
        <div style={{ fontSize:18, fontWeight:700, color:'var(--t1)', marginBottom:8 }}>Page Not Found</div>
        <div style={{ fontSize:14, color:'var(--t3)', marginBottom:28, maxWidth:320 }}>
          This route doesn't exist in the healthcare network.
        </div>
        <Link href="/" className="btn btn-primary" style={{ padding:'10px 24px', fontSize:14 }}>← Back to Dashboard</Link>
      </div>
    </>
  );
}
