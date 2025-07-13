import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import StockList from "./InventoryList";
import CreateStockModal from "./modals/CreateInventoryModal";

const InventoryPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col">
      <div className="flex-grow w-full px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Quản lý tồn kho</h2>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="group flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-4 py-2 text-sm"
              >
                <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Tạo phiếu tồn kho</span>
              </Button>
            </div>
          </div>
        </div>

        <StockList />
      </div>

      {showCreateModal && (
        <CreateStockModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default InventoryPage;