import '../styles/globals.css';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '70px', minHeight: '100vh' }}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
