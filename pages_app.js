import '../styles/globals.css'
import { DarkModeProvider } from '../contexts/DarkModeContext'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Apply the initial dark mode class based on the stored preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      document.body.className = 'bg-gray-900 text-white'
    } else {
      document.documentElement.classList.remove('dark')
      document.body.className = 'bg-white text-gray-800'
    }
  }, [])

  return (
    <DarkModeProvider>
      <div className="min-h-screen transition-colors duration-300">
        <Component {...pageProps} />
      </div>
    </DarkModeProvider>
  )
}

export default MyApp
