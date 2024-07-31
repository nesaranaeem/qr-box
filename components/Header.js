import { useState } from "react";
import Link from "next/link";
import { FaQrcode, FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white py-4 fixed top-0 left-0 right-0 z-10 transition-colors duration-300">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <FaQrcode className="text-2xl mr-2" />
          <h1 className="text-xl font-bold">QR Box</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">
            Home
          </Link>
          <Link href="/qr-code-scanner" className="hover:text-gray-600 dark:hover:text-gray-300">
            QR Scanner
          </Link>
        </nav>
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 mr-4"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <ul className="bg-gray-100 dark:bg-gray-800 py-2">
            <li>
              <Link href="/" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/qr-code-scanner"
                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                QR Scanner
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
