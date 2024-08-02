import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import QRCodeMaker from "../components/QRCodeMaker";
import { useDarkMode } from "../contexts/DarkModeContext";
import languageContent from "../data/languages.json";

export default function Home() {
  const { darkMode } = useDarkMode();
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "en";
    setLanguage(storedLanguage);
  }, []);

  const content = languageContent[language];

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } transition-colors duration-300`}
    >
      <Head>
        <title>{content.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
        <p className="mb-8">{content.description}</p>
        <QRCodeMaker language={language} />
      </main>

      <Footer language={language} />
    </div>
  );
}
