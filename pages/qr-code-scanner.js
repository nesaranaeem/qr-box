import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { QrReader } from 'react-qr-reader';
import { FaUpload, FaCamera } from 'react-icons/fa';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function QRCodeScanner() {
  const [result, setResult] = useState('');
  const [camera, setCamera] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const { darkMode } = useDarkMode();

  useEffect(() => {
    // Check if the device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setFacingMode('environment'); // Use back camera on mobile devices
    } else {
      setFacingMode('user'); // Use front camera on desktop
    }
  }, []);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      setCamera(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setResult(code.data);
        } else {
          setResult('No QR code found in the image.');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      <Head>
        <title>QR Code Scanner</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.jsdelivr.net/npm/jsqr@1.3.1/dist/jsQR.min.js"></script>
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6 mb-8`}>
            <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-6 rounded-lg`}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaUpload className="mr-2" /> Upload QR Code
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-2 rounded-md w-full`}
                />
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-6 rounded-lg`}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaCamera className="mr-2" /> Scan with Camera
                </h2>
                <button
                  onClick={() => setCamera(!camera)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2 w-full"
                >
                  {camera ? 'Stop Camera' : 'Start Camera'}
                </button>
                {camera && (
                  <div className="mt-4">
                    <QrReader
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: '100%' }}
                      constraints={{
                        facingMode: facingMode
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {result && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Scan Result:</h2>
                <p className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-md`}>{result}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
