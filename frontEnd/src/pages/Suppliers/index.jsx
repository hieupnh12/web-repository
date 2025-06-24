import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Building2, Mail, Phone, MapPin } from 'lucide-react';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock data - trong thực tế sẽ fetch từ API
  const mockSuppliers = [
    {
      id: 1,
      name: 'Công Ty TNHH Thế Giới Di Động',
      address: 'Phòng 6.5, Tầng 6, Tòa Nhà E-Town 2, 364 Cộng Hòa, P. 13, Q. Tân Bình',
      email: 'lienhe@thegioididong.com',
      phone: '02833100100',
      status: 'active'
    },
    {
      id: 2,
      name: 'Công ty Vinc Việt Nam',
      address: 'Số 78 Đường số 4, khu ng Phước 4, Phù Mỹ Hưng, quận 7, TPHCM',
      email: 'contact@vinc.vn',
      phone: '19006477',
      status: 'active'
    },
    {
      id: 3,
      name: 'Công Ty TNHH Bản Lá',
      address: '8/28 Hùm Bò Làn 7 sx, Q. Bình Thạnh, Tp. Hồ Chí Minh',
      email: 'contact@banla.vn',
      phone: '02633119000',
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Công Ty Nokia',
      address: 'Phòng 102, Tầng 2, Tòa nhà Metropolitan, 235 Đồng Khởi, P. Bến Nghé, Q...',
      email: 'chau.nguyen@nokia.com',
      phone: '02839281894',
      status: 'active'
    },
    {
      id: 5,
      name: 'Hệ Thống Phân Phối Chính Hãn...',
      address: '251 Út Kỳ, P. Út tán Q. Ngô Quyền, Tp. Hải Phòng',
      email: 'info@hinhome.vn',
      phone: '0658888666',
      status: 'pending'
    },
    {
      id: 6,
      name: 'Công Ty Samsung Việt Nam',
      address: 'Tòa nhà lê chính Blance, 2 Hải Triều, Bến Nghé, Quận 1, Thành phố Hồ Chí...',
      email: 'contact@samsung.vn',
      phone: '0988788456',
      status: 'active'
    },
    {
      id: 7,
      name: 'Công ty Oppo Việt Nam',
      address: '27 Q. Nguyễn Trung Trực, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh',
      email: 'oppo@vietnam@oppo.vn',
      phone: '0565469234',
      status: 'active'
    }
  ];

  // Simulate API call with pagination
  const fetchSuppliers = async (page, search = '', filter = 'all') => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = mockSuppliers;
    
    // Apply search filter
    if (search) {
      filteredData = filteredData.filter(supplier => 
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.email.toLowerCase().includes(search.toLowerCase()) ||
        supplier.phone.includes(search)
      );
    }
    
    // Apply status filter
    if (filter !== 'all') {
      filteredData = filteredData.filter(supplier => supplier.status === filter);
    }
    
    // Pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    setSuppliers(paginatedData);
    setTotalItems(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers(currentPage, searchTerm, selectedFilter);
  }, [currentPage, searchTerm, selectedFilter, itemsPerPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: 'Hoạt động', class: 'bg-green-100 text-green-800' },
      inactive: { text: 'Không hoạt động', class: 'bg-gray-100 text-gray-800' },
      pending: { text: 'Chờ duyệt', class: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> trong tổng số{' '}
              <span className="font-medium">{totalItems}</span> kết quả
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {pages.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                  currentPage === page
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Quản lý nhà cung cấp</h1>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Plus className="h-4 w-4 mr-2" />
                Thêm nhà cung cấp
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={selectedFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="pending">Chờ duyệt</option>
                </select>
              </div>

              {/* Items per page */}
              <div className="sm:w-32">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={5}>5/trang</option>
                  <option value={10}>10/trang</option>
                  <option value={20}>20/trang</option>
                  <option value={50}>50/trang</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhà cung cấp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : suppliers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy nhà cung cấp nào
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-indigo-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {supplier.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {supplier.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {supplier.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            {supplier.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            {supplier.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(supplier.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && suppliers.length > 0 && renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement;
=======
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  Fade,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Snackbar,
  Alert,
  Skeleton,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import axios from "axios";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%)",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(33, 150, 243, 0.1)",
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 12px 48px rgba(33, 150, 243, 0.2)",
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#2196f3",
    borderRadius: "10px",
    "&:hover": {
      background: "#1976d2",
    },
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#2196f3",
  "& .MuiTableCell-head": {
    color: "white",
    fontWeight: 600,
    fontSize: "0.95rem",
    borderBottom: "none",
    padding: "16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    boxShadow: "0 4px 20px rgba(33, 150, 243, 0.1)",
  },
  transition: "all 0.3s ease",
  cursor: "pointer",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 500,
  padding: "10px 24px",
  background: "linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)",
  boxShadow: "0 3px 15px rgba(33, 150, 243, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 25px rgba(33, 150, 243, 0.4)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    backgroundColor: "white",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(33, 150, 243, 0.1)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 20px rgba(33, 150, 243, 0.2)",
    },
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
  boxShadow: "0 4px 20px rgba(33, 150, 243, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 30px rgba(33, 150, 243, 0.2)",
  },
}));

// Sample data for demonstration
const sampleSuppliers = [
  {
    id: 1,
    name: "Công ty TNHH ABC",
    email: "abc@company.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    status: true,
  },
  {
    id: 2,
    name: "Công ty XYZ Ltd",
    email: "xyz@company.com",
    phone: "0987654321",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    status: false,
  },
  {
    id: 3,
    name: "Nhà cung cấp DEF",
    email: "def@supplier.com",
    phone: "0111222333",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    status: true,
  },
];

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Simulate API calls with sample data
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use sample data instead of API call
      setSuppliers(sampleSuppliers);
      
      setSnackbar({
        open: true,
        message: "Tải dữ liệu thành công",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi tải dữ liệu",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteSupplier = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      
      setSnackbar({
        open: true,
        message: "Xóa nhà cung cấp thành công",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi xóa nhà cung cấp",
        severity: "error",
      });
    }
  };

  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenDialog(true);
  };

  const handleAddNew = () => {
    setSnackbar({
      open: true,
      message: "Chức năng thêm mới đang được phát triển",
      severity: "info",
    });
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #2196f3, #1976d2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Quản Lý Nhà Cung Cấp
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Danh sách và thông tin chi tiết các nhà cung cấp
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="Làm mới" placement="top">
            <IconButton
              onClick={fetchSuppliers}
              disabled={loading}
              sx={{
                backgroundColor: "#e3f2fd",
                "&:hover": { backgroundColor: "#bbdefb" },
              }}
            >
              <RefreshIcon color="primary" />
            </IconButton>
          </Tooltip>
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            Thêm Nhà Cung Cấp
          </StyledButton>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Tổng Nhà Cung Cấp
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#2196f3", fontWeight: 600 }}
                  >
                    {suppliers.length}
                  </Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 48, color: "#90caf9" }} />
              </Box>
            </CardContent>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Đang Hoạt Động
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#4caf50", fontWeight: 600 }}
                  >
                    {suppliers.filter((s) => s.status).length}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, color: "#81c784" }} />
              </Box>
            </CardContent>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Tạm Dừng
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#f44336", fontWeight: 600 }}
                  >
                    {suppliers.filter((s) => !s.status).length}
                  </Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 48, color: "#e57373" }} />
              </Box>
            </CardContent>
          </InfoCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Tìm Kiếm
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "#ff9800", fontWeight: 600 }}
                  >
                    {filteredSuppliers.length}
                  </Typography>
                </Box>
                <SearchIcon sx={{ fontSize: 48, color: "#ffb74d" }} />
              </Box>
            </CardContent>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên Nhà Cung Cấp</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Địa Chỉ</TableCell>
                <TableCell align="center">Trạng Thái</TableCell>
                <TableCell align="center">Thao Tác</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7}>
                      <Skeleton animation="wave" height={60} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                filteredSuppliers
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((supplier, index) => (
                    <StyledTableRow key={supplier.id}>
                      <TableCell>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <BusinessIcon
                            color="primary"
                            fontSize="small"
                          />
                          <Typography variant="body2" fontWeight={500}>
                            {supplier.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <EmailIcon color="action" fontSize="small" />
                          {supplier.email}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <PhoneIcon color="action" fontSize="small" />
                          {supplier.phone}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LocationIcon
                            color="action"
                            fontSize="small"
                          />
                          <Tooltip
                            title={supplier.address}
                            placement="top"
                          >
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ maxWidth: 200 }}
                            >
                              {supplier.address}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            supplier.status ? "Hoạt động" : "Tạm dừng"
                          }
                          color={supplier.status ? "success" : "error"}
                          size="small"
                          icon={
                            supplier.status ? (
                              <CheckCircleIcon />
                            ) : (
                              <CancelIcon />
                            )
                          }
                          sx={{
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="Xem chi tiết" placement="top">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleViewDetails(supplier)
                              }
                              sx={{
                                color: "#2196f3",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.3s ease",
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa" placement="top">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeleteSupplier(supplier.id)
                              }
                              sx={{
                                color: "#f44336",
                                "&:hover": {
                                  backgroundColor: "#ffebee",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.3s ease",
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSuppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          sx={{
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        />
      </StyledPaper>

      {/* Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #2196f3, #64b5f6)",
            color: "white",
            fontWeight: 600,
          }}
        >
          Chi Tiết Nhà Cung Cấp
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedSupplier && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <BusinessIcon color="primary" />
                  <Typography variant="h6">{selectedSupplier.name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon color="action" />
                  <Typography>{selectedSupplier.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon color="action" />
                  <Typography>{selectedSupplier.phone}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <LocationIcon color="action" />
                  <Typography>{selectedSupplier.address}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Trạng thái:
                  </Typography>
                  <Chip
                    label={selectedSupplier.status ? "Hoạt động" : "Tạm dừng"}
                    color={selectedSupplier.status ? "success" : "error"}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Đóng
          </Button>
          <Button variant="contained" color="primary" startIcon={<EditIcon />}>
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Suppliers;
