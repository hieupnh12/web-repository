// import React, { useState, useEffect } from "react";
// import { createProduct, getBrands } from "../../../services/productService";
// import Button from "../../../components/ui/Button";

// const AddProduct = ({ onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     brandId: "",
//     os: "",
//     image: "",
//     description: "",
//   });

//   const [brands, setBrands] = useState([]);

//   useEffect(() => {
//     const fetchBrands = async () => {
//       const res = await getBrands();
//       setBrands(res.data || []);
//     };
//     fetchBrands();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createProduct(formData);
//       if (onSuccess) onSuccess(); // Reload danh sách hoặc đóng form
//     } catch (error) {
//       console.error("Lỗi khi thêm sản phẩm:", error);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white rounded-xl p-6 shadow-lg w-full max-w-2xl space-y-4"
//     >
//       <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Tên sản phẩm"
//           className="p-2 border border-gray-300 rounded"
//           required
//         />

//         <select
//           name="brandId"
//           value={formData.brandId}
//           onChange={handleChange}
//           className="p-2 border border-gray-300 rounded"
//           required
//         >
//           <option value="">-- Chọn hãng --</option>
//           {brands.map((brand) => (
//             <option key={brand.id} value={brand.id}>
//               {brand.name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           name="os"
//           value={formData.os}
//           onChange={handleChange}
//           placeholder="Hệ điều hành"
//           className="p-2 border border-gray-300 rounded"
//         />

//         <input
//           type="text"
//           name="image"
//           value={formData.image}
//           onChange={handleChange}
//           placeholder="URL hình ảnh"
//           className="p-2 border border-gray-300 rounded"
//         />
//       </div>

//       <textarea
//         name="description"
//         value={formData.description}
//         onChange={handleChange}
//         placeholder="Mô tả sản phẩm"
//         className="w-full p-2 border border-gray-300 rounded"
//         rows={3}
//       />

//       <div className="flex justify-end">
//         <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Lưu sản phẩm
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default AddProduct;
