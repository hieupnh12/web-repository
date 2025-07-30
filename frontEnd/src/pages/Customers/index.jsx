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
  takeCreateCustomer,
  takeDeleteCustomer,
  takeCustomer,
  takeUpdateCustomer,
  searchCustomers,
} from "../../services/customerService";
import { takeFunctionOfFeature } from "../../services/permissionService";

import CustomerTable from "./CustomerTable";
import EditCustomer from "./models/EditCustomer";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import CustomerDialog from "./models/AddCustomer";
import { useSelector } from "react-redux";
import { takeRoleVer1 } from "../../services/authService";

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

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchCustomers = async (
    pageNum = page,
    size = rowsPerPage,
    keyword = searchTerm
  ) => {
    setLoading(true);
    try {
      let response;
      if (keyword) {
        response = await searchCustomers(keyword, pageNum, size);
      } else {
        response = await takeCustomer(pageNum, size);
      }
      if (response.status === 200) {
        setCustomers(response.data.result.content);
        setTotalPages(response.data.result.totalPages);
        setTotalElements(response.data.result.totalElements);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Lỗi tải danh sách khách hàng: ${
          error.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (newCustomer) => {
    try {
      const response = await takeCreateCustomer(newCustomer);
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Thêm khách hàng thành công",
          severity: "success",
        });
        fetchCustomers();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Lỗi thêm khách hàng: ${
          error.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    }
  };

  const handleDeleteCustomer = async () => {
    setConfirmOpen(false);
    try {
      const response = await takeDeleteCustomer(selectedId);
      console.log("xóa", response);

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Xóa khách hàng thành công",
          severity: "success",
        });
        fetchCustomers();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Không thể xóa khách hàng: ${
          error.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    }
  };

  const handleSaveCustomer = async (updatedCustomer) => {
    try {
      const response = await takeUpdateCustomer(
        selectedCustomer.customerId,
        updatedCustomer
      );
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Cập nhật khách hàng thành công",
          severity: "success",
        });
        fetchCustomers();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Lỗi cập nhật khách hàng: ${
          error.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(0, rowsPerPage, searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddNew = () => setOpenCreate(true);

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleDeleteRequest = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const [permission, setPermission] = useState(null);

  const fetchPermission = async () => {
    try {
      const result = await takeFunctionOfFeature(8);
      // const info = await takeRoleVer1();
      setPermission(result.data.result[0]);
    } catch (err) {
      setPermission(null);
    }
  };

  const staffInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    if (staffInfo && staffInfo.roleName === "ADMIN") {
      setPermission(() => ({
        functionId: 8,
        canView: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
      }));
    } else {
      fetchPermission();
    }
  }, []);

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
          <Tooltip
            title={
              permission?.canCreate
                ? "Tạo khách hàng mới"
                : "Bạn không có quyền tạo khách hàng"
            }
            placement="top"
          >
            <span>
              <StyledButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                disabled={!permission?.canCreate}
                sx={{
                  opacity: permission?.canCreate ? 1 : 0.5,
                  cursor: permission?.canCreate ? "pointer" : "not-allowed",
                  pointerEvents: permission?.canCreate ? "auto" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                Thêm khách hàng
              </StyledButton>
            </span>
          </Tooltip>

          <CustomerDialog
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onSubmit={handleCreateCustomer}
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
            placeholder="Tìm theo tên, số điện thoại hoặc địa chỉ..."
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
              onClick={() => fetchCustomers(0, rowsPerPage, "")}
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

      <CustomerTable
        loading={loading}
        filteredCustomers={customers}
        page={page}
        rowsPerPage={rowsPerPage}
        totalElements={totalElements}
        totalPages={totalPages}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleEdit={handleEditClick}
        handleDeleteCustomer={handleDeleteRequest}
        permission={permission}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Xóa khách hàng"
        message="Bạn có chắc chắn muốn xóa khách hàng này không?"
        onConfirm={handleDeleteCustomer}
        onCancel={() => setConfirmOpen(false)}
      />

      <EditCustomer
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSaveCustomer}
        customerData={selectedCustomer}
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

export default Customers;
