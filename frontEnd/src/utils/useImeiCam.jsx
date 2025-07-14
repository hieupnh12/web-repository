import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  ArrowPathIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

const BarcodeScanner = ({ open, onClose, onResult }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const [status, setStatus] = useState("waiting"); // waiting, success, error, scanning
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const stopScanner = () => {
    try {
      if (codeReaderRef.current) {
        if (typeof codeReaderRef.current.stopContinuousDecode === "function") {
          codeReaderRef.current.stopContinuousDecode();
        }
        if (typeof codeReaderRef.current.reset === "function") {
          codeReaderRef.current.reset();
        }
        codeReaderRef.current = null;
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => {
          console.log("Stopping track:", track.label, track.readyState);
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
      console.log("Scanner stopped successfully");
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  const startScanner = async () => {
    if (!open) return;
    setIsLoading(true);
    setStatus("scanning");
    setIsScanning(true);
    codeReaderRef.current = new BrowserMultiFormatReader();

    let isCancelled = false;

    try {
      await codeReaderRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          // Ngăn callback xử lý nếu scanner đã dừng
          if (isCancelled) return;

          if (result) {
            const scannedText = result.getText();
            if (/^\d{15}$/.test(scannedText)) {
              setIsScanning(false);
              onResult && onResult(scannedText);
              isCancelled = true; // Đặt cờ để ngăn callback tiếp theo
              stopScanner();
              onClose();
            } else {
              console.log("Mã không hợp lệ");
              isCancelled = true;
              stopScanner();
            }
          }

          if (err && err.name !== "NotFoundException") {
            console.error("Scanning error:", err);
            setStatus("error");
            setIsScanning(false);
            setIsLoading(false);
            isCancelled = true;
            stopScanner();
          }
        }
      );

      setIsLoading(false);
    } catch (err) {
      console.error("Cannot access camera:", err);
      setStatus("error");
      setIsScanning(false);
      setIsLoading(false);
      isCancelled = true;
      stopScanner();
    }

    // Cleanup khi component unmount hoặc dừng scanner
    return () => {
      isCancelled = true;
      stopScanner();
    };
  };

  const resetScanner = () => {
    stopScanner();
    setStatus("waiting");
    setIsScanning(false);
    setIsLoading(true);
    setTimeout(() => startScanner(), 1000);
  };

  const handleClose = () => {
    stopScanner();
    console.log("out", stopScanner);

    setStatus("waiting");
    setIsScanning(false);
    setIsLoading(true);
    onClose && onClose();
  };

  useEffect(() => {
    let cleanup = null;
    if (open) {
      cleanup = startScanner();
    }

    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      } else {
        stopScanner();
      }
    };
  }, [open]);

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
