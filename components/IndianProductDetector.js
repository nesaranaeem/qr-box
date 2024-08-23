import React, { useState, useRef, useEffect } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { BrowserMultiFormatReader } from "@zxing/library";
import { FaUpload, FaCamera, FaStar } from "react-icons/fa";
import Confetti from "react-confetti";

const IndianProductDetector = () => {
  const [result, setResult] = useState(null);
  const [camera, setCamera] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [previewImage, setPreviewImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const { darkMode } = useDarkMode();
  const { content } = useLanguage();
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [confettiConfig, setConfettiConfig] = useState(null);

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

  const captureAndScan = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg");

      setCapturedImage(imageDataUrl);

      codeReader.current
        .decodeFromImage(undefined, imageDataUrl)
        .then((result) => {
          const scannedCode = result.getText();
          checkIfIndianProduct(scannedCode);
        })
        .catch((err) => {
          console.error("No barcode detected:", err);
          setResult({ type: "noBarcode", code: "" });
        });
    }
  };

  const checkIfIndianProduct = (code) => {
    if (code) {
      if (code.startsWith("890")) {
        setResult({ type: "indian", code: code });
        setConfettiConfig({
          numberOfPieces: 200,
          recycle: false,
          colors: ["#FF9933", "#FFFFFF", "#138808"],
        });
      } else if (code.startsWith("690") || code.startsWith("691") || code.startsWith("692")) {
        setResult({ type: "china", code: code });
        setConfettiConfig({
          numberOfPieces: 200,
          recycle: false,
          colors: ["#DE2910", "#FFDE00"],
        });
      } else if (code.startsWith("00") || code.startsWith("01")) {
        setResult({ type: "usa", code: code });
        setConfettiConfig({
          numberOfPieces: 200,
          recycle: false,
          colors: ["#B22234", "#FFFFFF", "#3C3B6E"],
        });
      } else if (code.startsWith("45") || code.startsWith("49")) {
        setResult({ type: "japan", code: code });
        setConfettiConfig({
          numberOfPieces: 200,
          recycle: false,
          colors: ["#FFFFFF", "#BC002D"],
        });
      } else if (code.startsWith("754") || code.startsWith("755")) {
        setResult({ type: "canada", code: code });
        setConfettiConfig({
          numberOfPieces: 200,
          recycle: false,
          colors: ["#FF0000", "#FFFFFF"],
        });
      } else if (code.startsWith("880")) {
        setResult({ type: "bangladesh", code: code });
        setConfettiConfig({
          numberOfPieces: 200,
          recycle: false,
          colors: ["#006A4E", "#F42A41"],
        });
      } else {
        setResult({ type: "unknown", code: code });
        setConfettiConfig({
          numberOfPieces: 100,
          recycle: false,
          colors: ["#FFD700", "#C0C0C0"],
        });
      }
    } else {
      setResult({ type: "noBarcode", code: "" });
      setConfettiConfig(null);
    }
    if (confettiConfig) {
      setTimeout(() => setConfettiConfig(null), 5000);
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
    <div
      className={`max-w-4xl mx-auto ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div
        className={`${
          darkMode ? "bg-gray-700" : "bg-gray-100"
        } shadow-md rounded-lg p-6 mb-8`}
      >
        <h1 className="text-2xl font-bold mb-4">
          {content.indianProductDetector}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`${
              darkMode ? "bg-gray-600" : "bg-gray-200"
            } p-6 rounded-lg`}
          >
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
          <div
            className={`${
              darkMode ? "bg-gray-600" : "bg-gray-200"
            } p-6 rounded-lg`}
          >
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
              <>
                <button
                  onClick={captureAndScan}
                  className={`bg-green-600 text-white px-4 py-2 rounded-md w-full mb-2`}
                >
                  {content.captureAndScan}
                </button>
                <div className="mt-4">
                  <video
                    ref={videoRef}
                    className="w-full h-48 object-cover rounded-lg"
                    autoPlay
                    playsInline
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center">
          {previewImage && (
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold mb-2">
                {content.uploadedBarcode}:
              </h2>
              <img
                src={previewImage}
                alt="Uploaded barcode"
                className="max-w-full h-auto rounded-lg mx-auto"
                style={{ maxHeight: "300px" }}
              />
            </div>
          )}
          {capturedImage && (
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold mb-2">
                {content.capturedBarcode}:
              </h2>
              <img
                src={capturedImage}
                alt="Captured barcode"
                className="max-w-full h-auto rounded-lg mx-auto"
                style={{ maxHeight: "300px" }}
              />
            </div>
          )}
          {result && (
            <div className="w-full max-w-md mt-4">
              <h2 className="text-xl font-semibold mb-2 text-center">
                {content.scanResult}:
              </h2>
              <div
                className={`p-4 rounded-lg ${
                  result.type === "indian"
                    ? "bg-orange-100 text-orange-800"
                    : result.type === "china" || result.type === "usa" || result.type === "japan" || result.type === "canada" || result.type === "bangladesh"
                    ? "bg-green-100 text-green-800"
                    : result.type === "unknown"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-lg font-medium text-center">
                  {result.type === "indian" && (
                    <>
                      <span className="mr-2">🇮🇳</span>
                      {content.indianProduct}
                    </>
                  )}
                  {result.type === "china" && (
                    <>
                      <span className="mr-2">🇨🇳</span>
                      {content.chineseProduct}
                    </>
                  )}
                  {result.type === "usa" && (
                    <>
                      <span className="mr-2">🇺🇸</span>
                      {content.usaProduct}
                    </>
                  )}
                  {result.type === "japan" && (
                    <>
                      <span className="mr-2">🇯🇵</span>
                      {content.japaneseProduct}
                    </>
                  )}
                  {result.type === "canada" && (
                    <>
                      <span className="mr-2">🇨🇦</span>
                      {content.canadianProduct}
                    </>
                  )}
                  {result.type === "bangladesh" && (
                    <>
                      <span className="mr-2">🇧🇩</span>
                      {content.bangladeshiProduct}
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
                  <p className="mt-2 text-center">
                    <strong>{content.barcodeText}:</strong> {result.code}
                  </p>
                )}
                {(result.type === "china" || result.type === "usa" || result.type === "japan" || result.type === "canada" || result.type === "bangladesh") && (
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, index) => (
                      <FaStar key={index} className="text-yellow-400 text-xl" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {confettiConfig && <Confetti {...confettiConfig} />}
    </div>
  );
};

export default IndianProductDetector;
