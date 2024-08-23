import React, { useState, useRef, useEffect } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { BrowserMultiFormatReader } from "@zxing/library";
import { FaUpload, FaCamera } from "react-icons/fa";
import Confetti from "react-confetti";

const IndianProductDetector = () => {
  const [result, setResult] = useState(null);
  const [camera, setCamera] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [previewImage, setPreviewImage] = useState(null);
  const { darkMode } = useDarkMode();
  const { content } = useLanguage();
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (camera) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [camera]);

  const startScanner = () => {
    if (!codeReader.current) {
      console.error("ZXing is not available");
      return;
    }
    codeReader.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, err) => {
        if (result) {
          const scannedCode = result.getText();
          checkIfIndianProduct(scannedCode);
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      }
    );
  };

  const stopScanner = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
  };

  const checkIfIndianProduct = (code) => {
    if (code) {
      if (code.startsWith("890")) {
        setResult({ type: "indian", code: code });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setResult({ type: "unknown", code: code });
      }
    } else {
      setResult({ type: "noBarcode", code: "" });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        codeReader.current
          .decodeFromImage(undefined, e.target.result)
          .then((result) => {
            const scannedCode = result.getText();
            checkIfIndianProduct(scannedCode);
          })
          .catch((err) => {
            console.error("No barcode detected:", err);
            setResult({ type: "noBarcode", code: "" });
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCamera = () => {
    setCamera(!camera);
  };

  return (
    <div className={`max-w-4xl mx-auto ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <div className={`${darkMode ? "bg-gray-700" : "bg-gray-100"} shadow-md rounded-lg p-6 mb-8`}>
        <h1 className="text-2xl font-bold mb-4">{content.indianProductDetector}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${darkMode ? "bg-gray-600" : "bg-gray-200"} p-6 rounded-lg`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUpload className="mr-2" /> {content.uploadBarcode}
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md w-full`}
            >
              {content.chooseImage}
            </button>
          </div>
          <div className={`${darkMode ? "bg-gray-600" : "bg-gray-200"} p-6 rounded-lg`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCamera className="mr-2" /> {content.scanWithCamera}
            </h2>
            <button
              onClick={toggleCamera}
              className={`bg-blue-600 text-white px-4 py-2 rounded-md w-full mb-2`}
            >
              {camera ? content.stopCamera : content.startCamera}
            </button>
            {camera && (
              <div className="mt-4">
                <video
                  ref={videoRef}
                  className="w-full h-48 object-cover rounded-lg"
                  autoPlay
                  playsInline
                />
              </div>
            )}
          </div>
        </div>
        {previewImage && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">{content.uploadedBarcode}:</h2>
            <img src={previewImage} alt="Uploaded barcode" className="max-w-full h-auto rounded-lg" />
          </div>
        )}
        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">{content.scanResult}:</h2>
            <div
              className={`p-4 rounded-lg ${
                result.type === "indian"
                  ? "bg-green-100 text-green-800"
                  : result.type === "unknown"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <p className="text-lg font-medium">
                {result.type === "indian" && (
                  <>
                    <span className="mr-2">🇮🇳</span>
                    {content.indianProduct}
                  </>
                )}
                {result.type === "unknown" && (
                  <>
                    <span className="mr-2">❓</span>
                    {content.unknownProductOrigin}
                  </>
                )}
                {result.type === "noBarcode" && content.noBarcodeFound}
              </p>
              {result.code && (
                <p className="mt-2">
                  <strong>{content.barcodeText}:</strong> {result.code}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {showConfetti && <Confetti />}
    </div>
  );
};

export default IndianProductDetector;
