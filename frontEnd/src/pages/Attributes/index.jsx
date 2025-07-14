import React, { useState } from "react";
import { Smartphone, Globe, Monitor, MemoryStick, HardDrive, Palette } from "lucide-react";

import BrandModal from "./modals/BrandModal";
import OriginModal from "./modals/OriginModal";
import OSModal from "./modals/OSModal";
import RamModal from "./modals/RAMModal";
import RomModal from "./modals/ROMModal";
import ColorModal from "./modals/ColorModal";

const ATTRIBUTE_TYPES = [
  { 
    id: "brand", 
    label: "Thương hiệu", 
    icon: Smartphone,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    iconColor: "text-purple-600"
  },
  { 
    id: "origin", 
    label: "Xuất xứ", 
    icon: Globe,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    iconColor: "text-blue-600"
  },
  { 
    id: "os", 
    label: "Hệ điều hành", 
    icon: Monitor,
    gradient: "from-green-500 to-teal-500",
    bgColor: "bg-gradient-to-br from-green-50 to-teal-50",
    iconColor: "text-green-600"
  },
  { 
    id: "ram", 
    label: "Ram", 
    icon: MemoryStick,
    gradient: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
    iconColor: "text-orange-600"
  },
  { 
    id: "rom", 
    label: "Rom", 
    icon: HardDrive,
    gradient: "from-indigo-500 to-purple-500",
    bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
    iconColor: "text-indigo-600"
  },
  { 
    id: "color", 
    label: "Màu sắc", 
    icon: Palette,
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-br from-pink-50 to-rose-50",
    iconColor: "text-pink-600"
  },
];

const AttributesPage = () => {
  const [openType, setOpenType] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleOpenModal = (type) => {
    setOpenType(type);
  };

  const handleCloseModal = () => {
    setOpenType(null);
  };

  const renderModal = () => {
    switch (openType) {
      case "brand":
        return <BrandModal open={true} onClose={handleCloseModal} />;
      case "origin":
        return <OriginModal open={true} onClose={handleCloseModal} />;
      case "os":
        return <OSModal open={true} onClose={handleCloseModal} />;
      case "ram":
        return <RamModal open={true} onClose={handleCloseModal} />;
      case "rom":
        return <RomModal open={true} onClose={handleCloseModal} />;
      case "color":
        return <ColorModal open={true} onClose={handleCloseModal} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div> */}

      <div className="relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Thuộc tính sản phẩm
          </h1>
          <p className="text-gray-600 text-lg">Chọn thuộc tính để quản lý</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ATTRIBUTE_TYPES.map((attr, index) => {
            const IconComponent = attr.icon;
            return (
              <div
                key={attr.id}
                className={`group relative cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                  hoveredCard === attr.id ? 'z-10' : ''
                }`}
                onMouseEnter={() => setHoveredCard(attr.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleOpenModal(attr.id)}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${attr.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>
                
                <div className={`relative ${attr.bgColor} rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm`}>
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${attr.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                       style={{
                         background: `linear-gradient(45deg, transparent, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%, transparent)`,
                         backgroundSize: '200% 200%',
                         animation: hoveredCard === attr.id ? 'shimmer 2s infinite' : 'none'
                       }}>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className={`relative p-4 rounded-2xl bg-white/70 group-hover:bg-white/90 transition-all duration-500 shadow-md group-hover:shadow-lg`}>
                      <IconComponent 
                        size={48} 
                        className={`${attr.iconColor} group-hover:scale-110 transition-transform duration-500`}
                      />
                      
                      <div className={`absolute inset-0 rounded-2xl border-2 border-gradient-to-r ${attr.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                           style={{
                             animation: hoveredCard === attr.id ? 'rotate 3s linear infinite' : 'none'
                           }}>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                      {attr.label}
                    </h3>
                    
                    <div className="h-1 w-0 group-hover:w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"></div>
                  </div>
                  
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 bg-gradient-to-r ${attr.gradient} rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000`}
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${20 + (i % 3) * 20}%`,
                          animationDelay: `${i * 200}ms`,
                          animation: hoveredCard === attr.id ? 'float 3s ease-in-out infinite' : 'none'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {renderModal()}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AttributesPage;