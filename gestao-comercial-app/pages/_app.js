import Head from 'next/head';
import '../styles/globals.css'; // ajuste o caminho se necessário

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0070f3" />
        <link rel="icon" href="/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gestão Comercial</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
