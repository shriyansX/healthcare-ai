import Head from 'next/head';
import '../styles/globals.css';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#06060f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%234f8ef7'/><stop offset='1' stop-color='%2306b6d4'/></linearGradient></defs><rect width='32' height='32' rx='8' fill='url(%23g)'/><rect x='14' y='6' width='4' height='20' rx='2' fill='white'/><rect x='6' y='14' width='20' height='4' rx='2' fill='white'/></svg>" />
      </Head>
      <Navbar />
      <main style={{ paddingTop: 58, minHeight: '100vh' }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
