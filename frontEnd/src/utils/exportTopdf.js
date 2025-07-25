import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ImportReceiptForm from "../pages/Stock/components/ImportContractTemPlate";
import ExportReceiptForm from "../pages/Stock/components/ExportContractTemplate";

export default function ContractPreviewModal({ data, onClose, IOreceipt = true }) {
  const handleDownloadPDF = async () => {
    const element = document.getElementById("contract-content");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("hop-dong.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white w-[900px] max-h-[90vh] rounded-xl p-6 shadow-xl overflow-y-auto relative custom-scroll">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">Xem trước hợp đồng</h2>

        {/* Nội dung hợp đồng */}
        <div
          id="contract-content"
          className="border p-4 rounded bg-white text-sm space-y-3"
        >
          {IOreceipt? <ImportReceiptForm data={data}/>:<ExportReceiptForm data={data} />}
        </div>

        {/* Nút tải xuống */}
        <button
          onClick={handleDownloadPDF}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Tải xuống PDF
        </button>
      </div>
    </div>
  );
}
