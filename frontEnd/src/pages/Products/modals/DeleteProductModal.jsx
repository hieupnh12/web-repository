import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../../components/ui/Button";
import { deleteProduct } from "../../../services/productService";

const DeleteProductModal = ({ product, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!product || !product.productId) {
      setError("Không tìm thấy sản phẩm hoặc ID sản phẩm không hợp lệ.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await deleteProduct(product.productId); 
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || "Không thể xóa sản phẩm. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose} aria-label="Xóa sản phẩm">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="text-red-500 text-center">
                Không tìm thấy sản phẩm để xóa.
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} aria-label="Xóa sản phẩm">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
              <Dialog.Title className="text-xl font-bold text-gray-800">
                Xóa sản phẩm
              </Dialog.Title>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Đóng"
                disabled={isLoading}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded">
                {error}
              </div>
            )}

            <Dialog.Description className="text-gray-600 mt-4 mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <span className="font-semibold">{product.productName || product.processor || "N/A"}</span>? Hành động này không thể hoàn tác.
            </Dialog.Description>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                ) : (
                  "Xóa"
                )}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteProductModal;