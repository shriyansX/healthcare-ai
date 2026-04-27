import Head from 'next/head';
import ExtractionForm from '../components/ExtractionForm';

export default function ExtractPage() {
  return (
    <>
      <Head>
        <title>AI Extraction — Healthcare AI</title>
        <meta name="description" content="Extract structured hospital data from messy text using AI" />
      </Head>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '860px' }}>
        <h1 className="page-title">🤖 AI Extraction</h1>
        <p className="page-subtitle">Convert messy hospital descriptions into structured data using regex + NLP</p>
        <div className="card">
          <ExtractionForm />
        </div>

        {/* How it works */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>⚙️ How It Works (Step 6–8)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              ['Step 6', 'Text → Structured', 'Regex patterns extract doctors, nurses, beds, ambulances, equipment, location'],
              ['Step 7', 'Equipment Scan',    'Scans for 15+ equipment keywords: MRI, CT scan, ICU, Ventilator, NICU...'],
              ['Step 8', 'Status Detection',  'if doctors < 5 → Medical Desert | if ICU not in equipment → Critical'],
            ].map(([step, title, desc]) => (
              <div key={step} style={{ display:'flex', gap:'1rem', padding:'0.75rem', background:'#0f172a', borderRadius:'8px', border:'1px solid #1e293b' }}>
                <span style={{ background:'rgba(59,130,246,0.15)', color:'#60a5fa', borderRadius:'6px', padding:'0.2rem 0.5rem', fontSize:'0.72rem', fontWeight:700, whiteSpace:'nowrap', alignSelf:'flex-start' }}>{step}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.88rem', marginBottom:'0.2rem' }}>{title}</div>
                  <div style={{ fontSize:'0.8rem', color:'#94a3b8' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
