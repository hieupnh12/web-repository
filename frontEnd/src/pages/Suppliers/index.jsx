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
  Card,
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
  takeUpdateSupplier,
} from "../../services/supplierService";
import SupplierDialog from "./modals/CreateSupplierDialog"; // Updated component name for consistency
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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Simulate API calls with sample data
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const supplierData = await takeSupplier();

      if (supplierData.status === 200) {
        setSuppliers(supplierData.data.result);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error loading data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async (newSupplier) => {
    try {
      const response = await takeCreateSupplier(newSupplier);

      if (response.status === 200) {
        // create don't load api
        setSuppliers([...suppliers, response.data.result]);
        setSnackbar({
          open: true,
          message: "Supplier added successfully",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error adding supplier",
        severity: "error",
      });
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      const deleteSupplier = await takeDeleteSupplier(selectedId);
      setConfirmOpen(false);
      if (deleteSupplier.status === 200) {
        // Delete don't load api
        setSuppliers(
          suppliers.filter((supplier) => supplier.id !== selectedId)
        );
        setSnackbar({
          open: true,
          message: "Supplier deleted successfully",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Supplier is in use",
        severity: "error",
      });
    }
  };

  // Callback khi lưu
  const handleSaveSupplier = async (updatedSupplier) => {
    try {
      const response = await takeUpdateSupplier(
        selectedSupplier.id,
        updatedSupplier
      );
      console.log("data update", response);
      if (response.status === 200) {
        // when update a supplier thì update data right away, don't load api
        setSuppliers((prev) =>
          prev.map((supplier) =>
            supplier.id === response.data.result.id
              ? response.data.result
              : supplier
          )
        );
        setSnackbar({
          open: true,
          message: "Supplier update successfully",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error update supplier",
        severity: "error",
      });
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

  const handleAddNew = () => {
    setOpenCreate(true);
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)
  );

  // Mở dialog
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            Add Supplier
          </StyledButton>
          <SupplierDialog
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onSubmit={handleCreateSupplier}
          />
        </Box>

        {/* Search Bar */}
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
            placeholder="Search by name, email, or phone number..."
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

          <Tooltip title="Refresh" placement="top">
            <IconButton
              onClick={fetchSuppliers}
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

      {/* Table */}
      <SupplierTable
        loading={loading}
        filteredSuppliers={filteredSuppliers}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleEdit={handleEditClick}
        handleDeleteSupplier={handleDeleteRequest}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier?"
        onConfirm={handleDeleteSupplier}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Detail Dialog */}
      <EditSupplier
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSaveSupplier}
        supplierData={selectedSupplier}
      />

      {/* Snackbar */}
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
