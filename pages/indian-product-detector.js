import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import IndianProductDetector from '../components/IndianProductDetector';
import { useLanguage } from '../contexts/LanguageContext';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function IndianProductDetectorPage() {
  const { content } = useLanguage();
  const { darkMode } = useDarkMode();

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Head>
        <title>{`${content.indianProductDetector} | ${content.title}`}</title>
        <meta name="description" content={content.indianProductDetectorDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <IndianProductDetector />
      </main>

      <Footer />
    </div>
  );
}
