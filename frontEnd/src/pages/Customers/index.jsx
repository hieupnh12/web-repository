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
  const [customers, setCustomers] = useState([]); // List of customers
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [totalElements, setTotalElements] = useState(0); // Total customers
  const [loading, setLoading] = useState(true); // Loading state
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [searchTerm, setSearchTerm] = useState(""); // Search keyword
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Selected customer
  const [openDialog, setOpenDialog] = useState(false); // Edit dialog
  const [openCreate, setOpenCreate] = useState(false); // Create dialog
  const [confirmOpen, setConfirmOpen] = useState(false); // Delete confirmation dialog
  const [selectedId, setSelectedId] = useState(null); // ID of customer to delete

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch customers or search results
  const fetchCustomers = async (pageNum = page, size = rowsPerPage, keyword = searchTerm) => {
    setLoading(true);
    try {
      let response;
      if (keyword) {
        console.log(keyword); 
        response = await searchCustomers(keyword, pageNum, size); // Call search API
        console.log(response);
        
      } else {
        response = await takeCustomer(pageNum, size); // Call list API
                // console.log(response);
      }
      if (response.status === 200) {
        setCustomers(response.data.result.content); // Set customer list
        setTotalPages(response.data.result.totalPages); // Set total pages
        setTotalElements(response.data.result.totalElements); // Set total customers
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error loading customers: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new customer
  const handleCreateCustomer = async (newCustomer) => {
    try {
      const response = await takeCreateCustomer(newCustomer);
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Customer added successfully",
          severity: "success",
        });
        fetchCustomers(); // Refresh list
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error adding customer: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    }
  };

  // Delete customer
  const handleDeleteCustomer = async () => {
    try {
      const response = await takeDeleteCustomer(selectedId);
      setConfirmOpen(false);
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Customer deleted successfully",
          severity: "success",
        });
        fetchCustomers(); // Refresh list
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Customer is in use: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    }
  };

  // Update customer
  const handleSaveCustomer = async (updatedCustomer) => {
    try {
      const response = await takeUpdateCustomer(
        selectedCustomer.customerId,
        updatedCustomer
      );
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Customer updated successfully",
          severity: "success",
        });
        fetchCustomers(); // Refresh list
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error updating customer: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    }
  };

  // Load customers when page or rows per page changes
  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchCustomers(0, rowsPerPage, searchTerm);
      } else {
        fetchCustomers(0, rowsPerPage, "");
      }
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