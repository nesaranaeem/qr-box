import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaUpload, FaCamera } from "react-icons/fa";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function QRCodeScanner() {
  const [result, setResult] = useState("");
  const [camera, setCamera] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const { darkMode } = useDarkMode();
  const { content } = useLanguage();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setFacingMode(isMobile ? "environment" : "user");
  }, []);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    if (camera) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [camera, facingMode]);

  const handleScan = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas
        .getContext("2d")
        .getImageData(0, 0, canvas.width, canvas.height);
      const code = window.jsQR(
        imageData.data,
        imageData.width,
        imageData.height
      );
      if (code) {
        setResult(code.data);
        setCamera(false);
      }
    }
  };

  const handleCapture = () => {
    handleScan();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = window.jsQR(
          imageData.data,
          imageData.width,
          imageData.height
        );
        if (code) {
          setResult(code.data);
        } else {
          setResult(content.noQRCodeFound);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } transition-colors duration-300`}
    >
      <Head>
        <title>{content.qrScanner}</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.jsdelivr.net/npm/jsqr@1.3.1/dist/jsQR.min.js"></script>
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-md rounded-lg p-6 mb-8`}
          >
            <h1 className="text-2xl font-bold mb-4">{content.qrScanner}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } p-6 rounded-lg`}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaUpload className="mr-2" /> {content.uploadQRCode}
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className={`border ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                  } p-2 rounded-md w-full`}
                />
              </div>
              <div
                className={`${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } p-6 rounded-lg`}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaCamera className="mr-2" /> {content.scanWithCamera}
                </h2>
                <button
                  onClick={() => setCamera(!camera)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2 w-full mb-2"
                >
                  {camera ? content.stopCamera : content.startCamera}
                </button>
                {camera && (
                  <button
                    onClick={handleCapture}
                    className="bg-green-600 text-white px-4 py-2 rounded-md mr-2 w-full"
                  >
                    {content.captureAndScan}
                  </button>
                )}
                {camera && (
                  <div className="mt-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      style={{ width: "100%" }}
                    />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                  </div>
                )}
              </div>
            </div>
            {result && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">
                  {content.scanResult}:
                </h2>
                <p
                  className={`${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } p-4 rounded-md`}
                >
                  {result}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
