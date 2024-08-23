import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import IndianProductDetector from '../components/IndianProductDetector';
import { useLanguage } from '../contexts/LanguageContext';

export default function IndianProductDetectorPage() {
  const { content } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{content.indianProductDetector} | {content.title}</title>
        <meta name="description" content={content.indianProductDetectorDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <IndianProductDetector />
      </main>

      <Footer />
    </div>
  );
}
