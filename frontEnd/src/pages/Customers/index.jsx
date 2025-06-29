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
} from "../../services/customerService";

import CustomerTable from "./CustomerTable";
import EditCustomer from "./models/EditCustomer";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import CustomerDialog from "./models/AddCustomer";

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

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await takeCustomer();
      if (response.status === 200) {
        setCustomers(response.data.result);
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Error loading customers",
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
        setCustomers([...customers, response.data.result]);
        setSnackbar({
          open: true,
          message: "Customer added successfully",
          severity: "success",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Error adding customer",
        severity: "error",
      });
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      const response = await takeDeleteCustomer(selectedId);
      setConfirmOpen(false);
      if (response.status === 200) {
        setCustomers(customers.filter((c) => c.customerId !== selectedId));
        setSnackbar({
          open: true,
          message: "Customer deleted successfully",
          severity: "success",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Customer is in use",
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
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.customerId === response.data.result.customerId
              ? response.data.result
              : customer
          )
        );
        setSnackbar({
          open: true,
          message: "Customer updated successfully",
          severity: "success",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Error updating customer",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddNew = () => setOpenCreate(true);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
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
            Add Customer
          </StyledButton>
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
            placeholder="Search by name, phone, or address..."
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
              onClick={fetchCustomers}
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
        filteredCustomers={filteredCustomers}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleEdit={handleEditClick}
        handleDeleteCustomer={handleDeleteRequest}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
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
