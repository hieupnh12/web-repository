import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  takeCreateSupplier,
  takeDeleteSupplier,
  takeSupplier,
  takeSupplierSearch,
  takeUpdateSupplier,
} from "../../services/supplierService";
import SupplierDialog from "./modals/CreateSupplierDialog";
import SupplierTable from "./SupplierTable";
import EditSupplier from "./modals/EditSupplier";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

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

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Lấy danh sách nhà cung cấp với phân trang
  const fetchSuppliers = async (pageNum = page, size = rowsPerPage) => {
    setLoading(true);
    try {
      const supplierData = await takeSupplier(pageNum, size);
      setSuppliers(supplierData.data.result.content);
      setTotalPages(supplierData.data.result.totalPages);
      setTotalElements(supplierData.data.result.totalElements);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Lỗi khi tải danh sách nhà cung cấp: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm nhà cung cấp với phân trang
  const searchSuppliers = async (keyword, pageNum = page, size = rowsPerPage) => {
    setLoading(true);
    try {
      const supplierData = await takeSupplierSearch(keyword, pageNum, size);
      setSuppliers(supplierData.data.result.content);
      setTotalPages(supplierData.data.result.totalPages);
      setTotalElements(supplierData.data.result.totalElements);
      setIsSearching(!!keyword);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Lỗi khi tải danh sách nhà cung cấp: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm với debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchSuppliers(searchTerm, 0, rowsPerPage);
        setPage(0);
      } else {
        fetchSuppliers(0, rowsPerPage);
        setPage(0);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, rowsPerPage]);

  // Lấy dữ liệu khi thay đổi trang hoặc số dòng mỗi trang
  useEffect(() => {
    if (isSearching) {
      searchSuppliers(searchTerm, page, rowsPerPage);
    } else {
      fetchSuppliers(page, rowsPerPage);
    }
  }, [page, rowsPerPage]);
  
  const handleCreateSupplier = async (newSupplier) => {
    try {
      const response = await takeCreateSupplier(newSupplier);
        console.log("sup", newSupplier);

      if (response.status === 200) {
        if (isSearching) {
          searchSuppliers(searchTerm, page, rowsPerPage);
        } else {
          fetchSuppliers(page, rowsPerPage);
        }
        setSnackbar({
          open: true,
          message: "Thêm nhà cung cấp thành công",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi thêm nhà cung cấp",
        severity: "error",
      });
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      const deleteSupplier = await takeDeleteSupplier(selectedId);
      setConfirmOpen(false);
      if (deleteSupplier.status === 200) {
        if (isSearching) {
          searchSuppliers(searchTerm, page, rowsPerPage);
        } else {
          fetchSuppliers(page, rowsPerPage);
        }
        setSnackbar({
          open: true,
          message: "Xóa nhà cung cấp thành công",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Không thể xóa nhà cung cấp vì đang được sử dụng",
        severity: "error",
      });
    }
  };

  const handleSaveSupplier = async (updatedSupplier) => {
    try {
      const response = await takeUpdateSupplier(selectedSupplier.id, updatedSupplier);
      if (response.status === 200) {
        if (isSearching) {
          searchSuppliers(searchTerm, page, rowsPerPage);
        } else {
          fetchSuppliers(page, rowsPerPage);
        }
        setSnackbar({
          open: true,
          message: "Cập nhật nhà cung cấp thành công",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi cập nhật nhà cung cấp",
        severity: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddNew = () => {
    setOpenCreate(true);
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenDialog(true);
  };

  const handleDeleteRequest = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            Thêm Nhà Cung Cấp
          </StyledButton>
          <SupplierDialog
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onSubmit={handleCreateSupplier}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "40%",
            alignItems: "center",
            gap: 1,
          }}
        >
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

          <Tooltip title="Làm mới" placement="top">
            <IconButton
              onClick={() => {
                setSearchTerm("");
                fetchSuppliers(0, rowsPerPage);
                setPage(0);
              }}
              disabled={loading}
              sx={{
                backgroundColor: "#e3f2fd",
                "&:hover": { backgroundColor: "#bbdefb" },
                height: "40px",
                width: "40px",
              }}
            >
              <RefreshIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <SupplierTable
        loading={loading}
        filteredSuppliers={suppliers}
        page={page}
        rowsPerPage={rowsPerPage}
        totalElements={totalElements}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleEdit={handleEditClick}
        handleDeleteSupplier={handleDeleteRequest}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Xóa Nhà Cung Cấp"
        message="Bạn có chắc chắn muốn xóa nhà cung cấp này không?"
        onConfirm={handleDeleteSupplier}
        onCancel={() => setConfirmOpen(false)}
      />

      <EditSupplier
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSaveSupplier}
        supplierData={selectedSupplier}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "400px",
            maxWidth: "500px",
          },
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", fontSize: "1.1rem", paddingY: 2, paddingX: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Suppliers;