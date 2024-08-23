import React, { useState, useRef, useEffect } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { BrowserMultiFormatReader } from "@zxing/library";

const IndianProductDetector = () => {
  const [result, setResult] = useState("");
  const [camera, setCamera] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const { darkMode } = useDarkMode();
  const { content } = useLanguage();
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

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
    <div
      className={`flex flex-col items-center ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">
        {content.indianProductDetector}
      </h1>
      <div className="mb-4 space-x-4">
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
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
            darkMode
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          {content.uploadBarcode}
        </button>
      </div>
      {camera && (
        <div
          ref={videoRef}
          className="mb-4 w-full max-w-lg h-64 bg-black rounded-lg overflow-hidden"
        />
      )}
      {result && (
        <div
          className={`p-4 rounded ${
            result.type === "indian"
              ? "bg-red-100 text-red-700"
              : result.type === "unknown"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {result.type === "indian" && (
            <>
              <span className="mr-2">🚫</span>
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
