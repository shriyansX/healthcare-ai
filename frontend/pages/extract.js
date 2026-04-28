import Head from 'next/head';
import ExtractionForm from '../components/ExtractionForm';

const STEPS = [
  { step: 'Step 6', icon: '📝', title: 'Text → Structured', desc: 'Regex patterns extract doctors, nurses, beds, ambulances, equipment, location from free-form text' },
  { step: 'Step 7', icon: '🔍', title: 'Equipment Scan',    desc: 'Scans for 15+ equipment keywords: MRI, CT scan, ICU, Ventilator, NICU, Blood Bank, Dialysis…' },
  { step: 'Step 8', icon: '🚦', title: 'Status Detection',  desc: 'doctors < 5 → Medical Desert | no ICU → Critical | partial equipment → Medium | else → Good' },
];

export default function ExtractPage() {
  return (
    <>
      <Head>
        <title>AI Extraction — Healthcare AI</title>
        <meta name="description" content="Extract structured hospital data from messy text using AI and NLP" />
      </Head>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '900px' }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">🤖 AI Extraction</h1>
          <p className="page-subtitle">
            Convert messy hospital descriptions into structured data using regex + NLP rule engine
          </p>
        </div>

        {/* Main form */}
        <div className="card fade-in fade-in-delay-1" style={{ marginBottom: '1.5rem' }}>
          <ExtractionForm />
        </div>

        {/* How it works */}
        <div className="card fade-in fade-in-delay-2">
          <div className="section-title">⚙️ How It Works</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem', padding: '1rem',
                background: 'rgba(10,15,30,0.5)',
                borderRadius: '10px', border: '1px solid rgba(30,41,59,0.8)',
                transition: 'all 0.2s',
                animation: `fadeInUp 0.3s ease ${i * 0.08}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(59,130,246,0.25)'; e.currentTarget.style.background='rgba(59,130,246,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(30,41,59,0.8)'; e.currentTarget.style.background='rgba(10,15,30,0.5)'; }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start', flexShrink: 0 }}>
                  <span style={{
                    background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
                    borderRadius: '6px', padding: '0.2rem 0.55rem',
                    fontSize: '0.7rem', fontWeight: 800, whiteSpace: 'nowrap',
                    border: '1px solid rgba(59,130,246,0.2)',
                  }}>{s.step}</span>
                  <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', color: '#f1f5f9' }}>{s.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
