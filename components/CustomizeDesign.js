import { FaImage } from "react-icons/fa";
import QRCode from "qrcode.react";
import { useDarkMode } from "../contexts/DarkModeContext";

const CustomizeDesign = ({ qrOptions, setQrOptions, content }) => {
  const { darkMode } = useDarkMode();

  const renderQRCode = () => {
    return (
      <QRCode
        value={qrOptions.value || "Preview"}
        size={128}
        fgColor={qrOptions.fgColor}
        bgColor={qrOptions.bgColor}
        level="L"
        renderAs="svg"
        imageSettings={
          qrOptions.logoImage
            ? {
                src: qrOptions.logoImage,
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }
            : undefined
        }
      />
    );
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setQrOptions({ ...qrOptions, logoImage: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {content.qrCodeColor}
        </label>
        <input
          type="color"
          value={qrOptions.fgColor}
          onChange={(e) =>
            setQrOptions({ ...qrOptions, fgColor: e.target.value })
          }
          className="p-1 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {content.backgroundColor}
        </label>
        <input
          type="color"
          value={qrOptions.bgColor}
          onChange={(e) =>
            setQrOptions({ ...qrOptions, bgColor: e.target.value })
          }
          className="p-1 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {content.uploadLogo}
        </label>
        <div className="flex items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FaImage className="mr-2" /> {content.chooseImage}
          </label>
          {qrOptions.logoImage && (
            <img
              src={qrOptions.logoImage}
              alt="Logo"
              className="ml-4 h-10 w-10 object-cover"
            />
          )}
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {content.realTimePreview}
        </label>
        <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
          {renderQRCode()}
        </div>
      </div>
    </div>
  );
};

export default CustomizeDesign;
