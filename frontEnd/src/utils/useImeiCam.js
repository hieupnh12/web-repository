// src/components/BarcodeScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [result, setResult] = useState("Chưa quét được mã nào");
  const codeReaderRef = useRef(null);

  useEffect(() => {
    const startScanner = async () => {
      codeReaderRef.current = new BrowserMultiFormatReader();

      try {
        await codeReaderRef.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result, err) => {
            if (result) {
              const scannedText = result.getText();

              if (/^\d{15}$/.test(scannedText)) {
                setResult(`IMEI: ${scannedText}`);
              } else {
                setResult(`Mã quét: ${scannedText} (Không phải IMEI 15 chữ số)`);
              }
            }

            if (err) {
              // Không kiểm tra NotFoundException nữa
              console.error("Lỗi khi quét:", err);
            }
          }
        );
      } catch (err) {
        console.error("Không thể truy cập camera:", err);
        setResult("Không thể truy cập camera");
      }
    };

    startScanner();

    return () => {
      codeReaderRef.current?.reset();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%" }} />
      <p>{result}</p>
    </div>
  );
};

export default BarcodeScanner;
