import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";
import {
  getAllROMs,
  getAllRAMs,
  getAllColors,
} from "../../../services/attributeService";
import { createProductVersion } from "../../../services/productVersionService";

const AddProductVersionModal = ({ productId, onSuccess, onClose }) => {
  const [versions, setVersions] = useState([{
    id: Date.now(),
    romId: "",
    ramId: "",
    colorId: "",
    rom: null,
    ram: null,
    color: null,
  }]);

  const [roms, setRoms] = useState([]);
  const [rams, setRams] = useState([]);
  const [colors, setColors] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getAllROMs(), getAllRAMs(), getAllColors()])
      .then(([romsData, ramsData, colorsData]) => {
        setRoms(romsData);
        setRams(ramsData);
        setColors(colorsData);
      })
      .catch(() => setApiError("Không thể tải dữ liệu thuộc tính sản phẩm."));
  }, []);

  const addVersion = () => {
    setVersions(prev => [...prev, {
      id: Date.now(),
      romId: "",
      ramId: "",
      colorId: "",
      rom: null,
      ram: null,
      color: null,
    }]);
  };

  const removeVersion = (id) => {
    if (versions.length > 1) {
      setVersions(prev => prev.filter(v => v.id !== id));
      // Clear errors for removed version
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`rom_${id}`];
        delete newErrors[`ram_${id}`];
        delete newErrors[`color_${id}`];
        return newErrors;
      });
    }
  };

  const handleVersionChange = (id, field, value) => {
    setVersions(prev => prev.map(version => {
      if (version.id === id) {
        let updatedVersion = { ...version, [field]: value };
        
        // Find and store the full object
        if (field === 'romId') {
          updatedVersion.rom = roms.find(r => r.rom_id === parseInt(value)) || null;
        } else if (field === 'ramId') {
          updatedVersion.ram = rams.find(r => r.id === parseInt(value)) || null;
        } else if (field === 'colorId') {
          updatedVersion.color = colors.find(c => c.id === parseInt(value)) || null;
        }
        
        return updatedVersion;
      }
      return version;
    }));

    // Clear error when user selects
    const errorKey = `${field.replace('Id', '')}_${id}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  const validateVersions = () => {
    const newErrors = {};
    let hasErrors = false;

    versions.forEach(version => {
      if (!version.romId) {
        newErrors[`rom_${version.id}`] = "ROM";
        hasErrors = true;
      }
      if (!version.ramId) {
        newErrors[`ram_${version.id}`] = "RAM";
        hasErrors = true;
      }
      if (!version.colorId) {
        newErrors[`color_${version.id}`] = "Màu";
        hasErrors = true;
      }
    });

    // Check for duplicate combinations
    const combinations = versions.map(v => `${v.romId}-${v.ramId}-${v.colorId}`);
    const duplicates = combinations.filter((item, index) => combinations.indexOf(item) !== index);
    
    if (duplicates.length > 0) {
      versions.forEach(version => {
        const combo = `${version.romId}-${version.ramId}-${version.colorId}`;
        if (duplicates.includes(combo)) {
          newErrors[`duplicate_${version.id}`] = "Tổ hợp này đã tồn tại";
          hasErrors = true;
        }
      });
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateVersions()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create all versions
      const promises = versions.map(version => 
        createProductVersion({
          productId,
          romId: Number(version.romId),
          ramId: Number(version.ramId),
          colorId: Number(version.colorId),
          importPrice: 0, // Default to 0 as requested
          exportPrice: 0, // Default to 0 as requested
          status: true, // Always active as requested
        })
      );

      await Promise.all(promises);
      
      setSuccessMessage(`Đã tạo thành công ${versions.length} phiên bản sản phẩm`);
      if (onSuccess) onSuccess();
      setTimeout(() => onClose && onClose(), 2000);
    } catch (err) {
      setApiError("Không thể tạo phiên bản. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRomSize = (romSize) => {
    return `${romSize}GB`;
  };

  const formatRamSize = (ramName) => {
    return ramName.includes('GB') ? ramName : `${ramName}GB`;
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 flex items-center justify-between">
                <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Thêm phiên bản sản phẩm
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Alert Messages */}
                {apiError && (
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-red-700 font-medium">{apiError}</p>
                  </div>
                )}
                {successMessage && (
                  <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                    <p className="text-green-700 font-medium">{successMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Add Version Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Danh sách phiên bản ({versions.length})
                    </h3>
                    <button
                      type="button"
                      onClick={addVersion}
                      className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Thêm phiên bản
                    </button>
                  </div>

                  {/* Versions Table */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">#</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[150px]">
                              ROM <span className="text-red-500">*</span>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[150px]">
                              RAM <span className="text-red-500">*</span>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[150px]">
                              Màu sắc <span className="text-red-500">*</span>
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-20">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {versions.map((version, index) => (
                            <tr key={version.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              
                              {/* ROM Column */}
                              <td className="px-4 py-3">
                                <div className="space-y-1">
                                  <select
                                    value={version.romId}
                                    onChange={(e) => handleVersionChange(version.id, 'romId', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                      errors[`rom_${version.id}`] || errors[`duplicate_${version.id}`]
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                                        : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                                    }`}
                                  >
                                    <option value="">Chọn ROM</option>
                                    {roms.map((rom) => (
                                      <option key={rom.rom_id} value={rom.rom_id}>
                                        {formatRomSize(rom.rom_size)}
                                      </option>
                                    ))}
                                  </select>
                                  {errors[`rom_${version.id}`] && (
                                    <p className="text-red-500 text-xs">{errors[`rom_${version.id}`]}</p>
                                  )}
                                </div>
                              </td>

                              {/* RAM Column */}
                              <td className="px-4 py-3">
                                <div className="space-y-1">
                                  <select
                                    value={version.ramId}
                                    onChange={(e) => handleVersionChange(version.id, 'ramId', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                      errors[`ram_${version.id}`] || errors[`duplicate_${version.id}`]
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                                        : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                                    }`}
                                  >
                                    <option value="">Chọn RAM</option>
                                    {rams.map((ram) => (
                                      <option key={ram.id} value={ram.id}>
                                        {formatRamSize(ram.name)}
                                      </option>
                                    ))}
                                  </select>
                                  {errors[`ram_${version.id}`] && (
                                    <p className="text-red-500 text-xs">{errors[`ram_${version.id}`]}</p>
                                  )}
                                </div>
                              </td>

                              {/* Color Column */}
                              <td className="px-4 py-3">
                                <div className="space-y-1">
                                  <select
                                    value={version.colorId}
                                    onChange={(e) => handleVersionChange(version.id, 'colorId', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                      errors[`color_${version.id}`] || errors[`duplicate_${version.id}`]
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                                        : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                                    }`}
                                  >
                                    <option value="">Chọn màu</option>
                                    {colors.map((color) => (
                                      <option key={color.id} value={color.id}>
                                        {color.name}
                                      </option>
                                    ))}
                                  </select>
                                  {errors[`color_${version.id}`] && (
                                    <p className="text-red-500 text-xs">{errors[`color_${version.id}`]}</p>
                                  )}
                                </div>
                              </td>

                              {/* Actions Column */}
                              <td className="px-4 py-3 text-center">
                                {versions.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeVersion(version.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-colors"
                                    title="Xóa phiên bản này"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Show duplicate error globally */}
                    {Object.keys(errors).some(key => key.startsWith('duplicate_')) && (
                      <div className="px-4 py-3 bg-red-50 border-t border-red-200">
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          Phát hiện các tổ hợp trùng lặp. Vui lòng kiểm tra lại.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-semibold">{versions.length}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Tóm tắt</h4>
                        <p className="text-blue-700 text-sm">
                          Bạn đang thêm <strong>{versions.length}</strong> phiên bản sản phẩm. 
                          Tất cả sẽ được tạo với trạng thái hoạt động và giá mặc định là 0.
                        </p>
                      </div>
                    </div>
                  </div>

                </form>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-end gap-4">
                  <Button 
                    onClick={onClose} 
                    type="button" 
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    type="button"
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={isSubmitting || versions.length === 0}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang tạo {versions.length} phiên bản...
                      </div>
                    ) : (
                      `Tạo ${versions.length} phiên bản`
                    )}
                  </Button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddProductVersionModal;