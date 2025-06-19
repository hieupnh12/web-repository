// ConfirmDialog.jsx
import React from 'react';
import ReactDOM from 'react-dom';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            disabled={loading}
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes'}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') // nơi để "portal" hiển thị
  );
}
