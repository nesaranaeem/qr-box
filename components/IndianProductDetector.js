import React, { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Quagga from 'quagga';

const IndianProductDetector = () => {
  const [result, setResult] = useState('');
  const [camera, setCamera] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const { darkMode } = useDarkMode();
  const { content } = useLanguage();
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isQuaggaInitialized, setIsQuaggaInitialized] = useState(false);

  useEffect(() => {
    if (camera) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [camera]);

  const startScanner = () => {
    if (!Quagga) {
      console.error('Quagga is not available');
      return;
    }
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 640,
            height: 480,
            facingMode: facingMode,
          },
          target: videoRef.current,
        },
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: ['ean_reader', 'ean_8_reader', 'code_128_reader', 'code_39_reader', 'code_93_reader', 'upc_reader', 'upc_e_reader'],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
        setIsQuaggaInitialized(true);
      }
    );

    Quagga.onDetected(handleScan);
  };

  const stopScanner = () => {
    if (isQuaggaInitialized) {
      Quagga.stop();
      setIsQuaggaInitialized(false);
    }
  };

  const handleScan = (data) => {
    if (data && data.codeResult) {
      const scannedCode = data.codeResult.code;
      checkIfIndianProduct(scannedCode);
    }
  };

  const checkIfIndianProduct = (code) => {
    console.log('Checking if Indian product:', code);
    if (code) {
      // Check if the barcode starts with 890 (Indian product code)
      if (code.startsWith('890')) {
        console.log('Indian product detected');
        setResult({ type: 'indian', code: code });
      } else {
        console.log('Non-Indian product detected');
        setResult({ type: 'unknown', code: code });
      }
    } else {
      console.log('No barcode provided');
      setResult({ type: 'noBarcode', code: '' });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Quagga.decodeSingle(
          {
            src: e.target.result,
            numOfWorkers: navigator.hardwareConcurrency || 4,
            decoder: {
              readers: ['ean_reader', 'ean_8_reader', 'code_128_reader', 'code_39_reader', 'code_93_reader', 'upc_reader', 'upc_e_reader'],
            },
            locate: true,
            debug: true,
          },
          (result) => {
            console.log('Quagga result:', result);
            if (result && result.codeResult) {
              console.log('Barcode detected:', result.codeResult.code);
              checkIfIndianProduct(result.codeResult.code);
            } else {
              console.log('No barcode detected');
              setResult({ type: 'noBarcode', code: '' });
            }
          }
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCamera = () => {
    setCamera(!camera);
  };

  return (
    <div className={`flex flex-col items-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-2xl font-bold mb-4">{content.indianProductDetector}</h1>
      <div className="mb-4 space-x-4">
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded ${
            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {camera ? content.stopCamera : content.startCamera}
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className={`px-4 py-2 rounded ${
            darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {content.uploadBarcode}
        </button>
      </div>
      {camera && (
        <div ref={videoRef} className="mb-4 w-full max-w-lg h-64 bg-black rounded-lg overflow-hidden" />
      )}
      {result && (
        <div
          className={`p-4 rounded ${
            result.type === 'indian'
              ? 'bg-red-100 text-red-700'
              : result.type === 'notIndian'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {result.type === 'indian' && (
            <>
              <span className="mr-2">🚫</span>
              {content.indianProduct}
            </>
          )}
          {result.type === 'unknown' && (
            <>
              <span className="mr-2">❓</span>
              {content.unknownProductOrigin}
            </>
          )}
          {result.type === 'noBarcode' && content.noBarcodeFound}
          {result.code && (
            <p className="mt-2">
              <strong>{content.barcodeText}:</strong> {result.code}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default IndianProductDetector;
