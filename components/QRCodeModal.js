import React from 'react';
import QRCode from 'qrcode.react';
import { FaDownload, FaCopy, FaTimes } from 'react-icons/fa';
import { useDarkMode } from '../contexts/DarkModeContext';

const QRCodeModal = ({ isOpen, onClose, qrCodeOptions, downloadQR, copyToClipboard }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Generated QR Code</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <QRCode
            id="qr-code"
            value={qrCodeOptions.value}
            size={qrCodeOptions.size}
            fgColor={qrCodeOptions.fgColor}
            bgColor={qrCodeOptions.bgColor}
            level="H"
            includeMargin={true}
            imageSettings={qrCodeOptions.logoImage ? {
              src: qrCodeOptions.logoImage,
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            } : undefined}
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={downloadQR}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700 transition duration-300"
          >
            <FaDownload className="mr-2" /> Download
          </button>
          <button
            onClick={copyToClipboard}
            className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-purple-700 transition duration-300"
          >
            <FaCopy className="mr-2" /> Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
