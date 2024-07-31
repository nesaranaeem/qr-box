import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import QRCodeMaker from "../components/QRCodeMaker";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>QR Box</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <QRCodeMaker />
      </main>

      <Footer />
    </div>
  );
}
