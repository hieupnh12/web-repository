import React from "react";
import ReactDOM from "react-dom";

const actionStyles = {
  delete: {
    bg: "from-red-500 to-red-400",
    hover: "hover:from-red-700 hover:to-red-600",
    text: "Delete",
    loading: "Deleting...",
  },
  update: {
    bg: "from-blue-600 to-blue-500",
    hover: "hover:from-blue-700 hover:to-blue-600",
    text: "Update",
    loading: "Updating...",
  },
  create: {
    bg: "from-green-600 to-green-500",
    hover: "hover:from-green-700 hover:to-green-600",
    text: "Create",
    loading: "Creating...",
  },
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  action = "delete", // default là delete
}) {
  if (!isOpen) return null;

  const style = actionStyles[action] || actionStyles["delete"];

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in">
        {/* Header */}
        <div className={`bg-gradient-to-r ${style.bg} text-white px-6 py-4`}>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-5 text-gray-700 text-sm">
          <p>{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg bg-gradient-to-r ${style.bg} text-white font-semibold ${style.hover} transition`}
            disabled={loading}
          >
            {loading ? style.loading : style.text}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
