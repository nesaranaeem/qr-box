import "../styles/globals.css";
import { DarkModeProvider } from "../contexts/DarkModeContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  return (
    <DarkModeProvider>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </DarkModeProvider>
  );
}

export default MyApp;
