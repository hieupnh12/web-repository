import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  ArrowPathIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const BarcodeScanner = ({ open, onClose, onResult }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [status, setStatus] = useState("waiting");
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [lastScanned, setLastScanned] = useState({ code: null, time: 0 });

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
          if (isCancelled) return;

          if (result) {
            const scannedText = result.getText();
            const now = Date.now();

            // Prevent duplicate scans within 2 seconds
            if (
              /^\d{15}$/.test(scannedText) &&
              (lastScanned.code !== scannedText || now - lastScanned.time > 3000)
            ) {
              if (!scannedCodes.includes(scannedText)) {
                setScannedCodes((prev) => [scannedText, ...prev]);
                setLastScanned({ code: scannedText, time: now });
                onResult && onResult(scannedText);
                // toast.success("Scanned successfully!");
              } else {
                toast.info("Code already scanned");
              }
            } else if (!/^\d{15}$/.test(scannedText)) {
              toast.warning("Invalid IMEI format");
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
      toast.error("Cannot access camera: " + err.message);
      setStatus("error");
      setIsScanning(false);
      setIsLoading(false);
      isCancelled = true;
      stopScanner();
    }

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

  const clearScannedCodes = () => {
    setScannedCodes([]);
    setLastScanned({ code: null, time: 0 });
    toast.info("Cleared scanned codes");
  };

  const handleClose = () => {
    stopScanner();
    setStatus("waiting");
    setIsScanning(false);
    setIsLoading(true);
    setScannedCodes([]);
    setLastScanned({ code: null, time: 0 });
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex">
        {/* Scanner Section */}
        <div className="w-2/3">
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

          {/* Camera Preview */}
          <div className="p-6">
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

        {/* Scanned Codes List */}
        <div className="w-1/3 bg-gray-100 p-6 rounded-r-2xl overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Scanned Codes</h3>
            <button
              onClick={clearScannedCodes}
              className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-gray-200 transition-colors duration-200"
              title="Clear all codes"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          {scannedCodes.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No codes scanned yet</p>
          ) : (
            <ul className="space-y-3">
              {scannedCodes.map((code, index) => (
                <li
                  key={index}
                  className="p-3 bg-white rounded-lg shadow-sm text-sm text-gray-700 break-all transition-transform duration-300 ease-in-out transform hover:scale-102 hover:shadow-md animate-slide-in"
                >
                  <span className="font-medium text-gray-900">#{index + 1}</span> {code}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease forwards;
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