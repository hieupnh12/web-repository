
import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  QrCodeIcon,
  CameraIcon,
  ArrowPathIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
} from "@heroicons/react/24/solid";

const BarcodeScanner = ({ open, onClose, onResult }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const scannedRef = useRef(new Set()); // ✅ lưu các mã đã quét

  const [result, setResult] = useState("No barcode scanned yet");
  const [status, setStatus] = useState("waiting"); // waiting, success, error, scanning
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const stopScanner = () => {
    if (codeReaderRef.current) {
      if (typeof codeReaderRef.current.stopContinuousDecode === "function") {
        codeReaderRef.current.stopContinuousDecode();
      } else if (typeof codeReaderRef.current.reset === "function") {
        codeReaderRef.current.reset();
      }
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startScanner = async () => {
    if (!open) return;

    setIsLoading(true);
    setStatus("scanning");
    setIsScanning(true);
    scannedRef.current.clear(); // ✅ clear danh sách mã cũ khi khởi động mới

    codeReaderRef.current = new BrowserMultiFormatReader();

    try {
      await codeReaderRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          if (result) {
            const scannedText = result.getText();

            if (scannedRef.current.has(scannedText)) return; // ✅ bỏ qua mã trùng
            scannedRef.current.add(scannedText); // ✅ lưu mã đã quét (dù đúng/sai)

            setResult(scannedText);

            if (/^\d{15}$/.test(scannedText)) {
  setStatus("success");
  setIsScanning(false);
  onResult && onResult(scannedText, true);
  stopScanner(); 
  setResult("");
} else {
  setStatus("error");

  // ✅ chỉ gọi onResult với mã sai nếu đây là lần đầu gặp
  onResult && onResult(scannedText, false);
  setResult("");
}
          }

          if (err && err.name !== "NotFoundException") {
            console.error("Scanning error:", err);
          }
        }
      );
      setIsLoading(false);
    } catch (err) {
      console.error("Cannot access camera:", err);
      setResult("Cannot access camera");
      setStatus("error");
      setIsScanning(false);
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    stopScanner();
    setResult("No barcode scanned yet");
    setStatus("waiting");
    setIsScanning(false);
    setIsLoading(true);
    scannedRef.current.clear(); // ✅ reset danh sách quét khi reset
    setTimeout(() => startScanner(), 1000);
  };

  const handleClose = () => {
    stopScanner();
    setResult("No barcode scanned yet");
    setStatus("waiting");
    setIsScanning(false);
    setIsLoading(true);
    scannedRef.current.clear();
    onClose && onClose();
  };

  useEffect(() => {
    if (open) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [open]);

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircleIconSolid className="w-6 h-6 text-green-500" />;
      case "error":
        return <ExclamationTriangleIconSolid className="w-6 h-6 text-red-500" />;
      case "scanning":
        return <QrCodeIcon className="w-6 h-6 text-blue-500" />;
      default:
        return <CameraIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    if (/^\d{15}$/.test(result) && status === "success") return "Valid IMEI";
    if (status === "error" && result !== "Cannot access camera") return "Not a 15-digit IMEI";
    if (status === "scanning") return "Scanning...";
    return "Ready to scan";
  };

  const getStatusBadgeClasses = () => {
    if (status === "success") return "bg-green-100 text-green-800 border-green-300";
    if (status === "error") return "bg-red-100 text-red-800 border-red-300";
    if (status === "scanning") return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DevicePhoneMobileIcon className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">IMEI Scanner</h2>
                <p className="text-sm">Scan barcode to verify IMEI</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Camera Preview */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-sm border-2 border-blue-500 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white shadow-lg">
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                    <p className="text-sm">Starting camera...</p>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                className="w-full h-64 object-cover bg-black"
                autoPlay
                muted
                playsInline
              />

              {/* Scan line */}
              {isScanning && (
                <div
                  className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-lg"
                  style={{
                    animation: "scanLine 2s ease-in-out infinite",
                  }}
                />
              )}

              {/* Corner markers */}
              <div className="absolute top-5 left-5 w-5 h-5 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
              <div className="absolute top-5 right-5 w-5 h-5 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
              <div className="absolute bottom-5 left-5 w-5 h-5 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
              <div className="absolute bottom-5 right-5 w-5 h-5 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>

              <button
                onClick={resetScanner}
                className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md"
              >
                <ArrowPathIcon className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 font-medium ${getStatusBadgeClasses()}`}>
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </div>

          {/* Result */}
          {result !== "No barcode scanned yet" && (
            <div className="space-y-4 animate-fade-in">
              <div className={`p-4 rounded-xl border-2 ${
                status === "success"
                  ? "bg-green-50 border-green-200"
                  : status === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusIcon()}
                  <h3 className="text-lg font-semibold">Scan Result</h3>
                </div>
                <div className="bg-white bg-opacity-80 p-3 rounded-lg border border-dashed border-gray-400">
                  <p className={`text-lg font-mono text-center ${
                    status === "success"
                      ? "text-green-600"
                      : status === "error"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}>
                    {result}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
