import Head from 'next/head';
import '../styles/globals.css';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050912" />
        <meta name="description" content="Healthcare AI Dashboard — Real-time analytics across India's hospital network" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏥</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <Navbar />
      <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
