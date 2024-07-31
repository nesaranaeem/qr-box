import '../styles/globals.css'
import { DarkModeProvider } from '../contexts/DarkModeContext'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Apply the initial dark mode class based on the stored preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    document.documentElement.classList.toggle('dark', isDarkMode)
    if (isDarkMode) {
      document.body.classList.add('bg-gray-900', 'text-white')
    } else {
      document.body.classList.add('bg-white', 'text-gray-800')
    }
  }, [])

  return (
    <DarkModeProvider>
      <Component {...pageProps} />
    </DarkModeProvider>
  )
}

export default MyApp
