// Staff.jsx
import React, { useEffect, useState } from "react";
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
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StaffDialog from "./CreateStaff";
import EditStaff from "./EditStaff";
import StaffTable from "./StaffTable";
import {
  fetchStaffList,
  createStaff,
  editStaff,
  removeStaff,
} from "../../services/staffService";

const StyledButton = styled(Button)(() => ({
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

const StyledTextField = styled(TextField)(() => ({
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

export default function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false); // ✅ thêm để xử lý loading nút xóa

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadStaffs = async () => {
    setLoading(true);
    try {
      const response = await fetchStaffList();
      if (response.status === 200) {
        setStaffs(response.data.result);
      }
    } catch {
      setSnackbar({ open: true, message: "Error loading employee list", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffs();
  }, []);

  const handleCreateStaff = async (newStaff) => {
    try {
      const response = await createStaff(newStaff);
      if (response.status === 200) {
        setStaffs([...staffs, response.data.result]);
        setSnackbar({ open: true, message: "Add employee successfully", severity: "success" });
      }
    } catch {
      setSnackbar({ open: true, message: "Error adding employee", severity: "error" });
    }
  };

  const handleSaveStaff = async (updatedStaff) => {
    try {
      const response = await editStaff(selectedStaff.staffId, updatedStaff);
      if (response.status === 200) {
        setStaffs((prev) =>
          prev.map((s) =>
            s.staffId === response.data.result.staffId ? response.data.result : s
          )
        );
        setSnackbar({ open: true, message: "Employee update successful", severity: "success" });
        setOpenEdit(false);
        setSelectedStaff(null);
      }
    } catch {
      setSnackbar({ open: true, message: "Error while updating", severity: "error" });
    }
  };

  const handleDeleteStaff = async () => {
    try {
      setDeleting(true);
      const response = await removeStaff(selectedId);
      if (response.status === 200) {
        setStaffs((prev) => prev.filter((s) => s.staffId !== selectedId));
        setSnackbar({ open: true, message: "Delete successful", severity: "success" });
      }
    } catch {
      setSnackbar({ open: true, message: "Staff currently employed", severity: "error" });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const filtered = staffs.filter(
    (staff) =>
      staff.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      staff.phoneNumber?.includes(search) ||
      staff.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <StyledButton variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
          Thêm
        </StyledButton>
        <Box sx={{ display: "flex", width: "40%", alignItems: "center", gap: 1 }}>
          <StyledTextField
            fullWidth
            placeholder="Search by name, phone number or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Reload">
            <IconButton onClick={loadStaffs} disabled={loading}>
              <RefreshIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Table */}
      <StaffTable
        loading={loading}
        filteredStaffs={filtered}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={(e, newPage) => setPage(newPage)}
        handleChangeRowsPerPage={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        handleEdit={(staff) => {
          setSelectedStaff(staff);
          setOpenEdit(true);
        }}
        handleDeleteRequest={(id) => {
          setSelectedId(id);
          setConfirmOpen(true);
        }}
      />

      {/* Dialogs */}
      {openCreate && (
        <StaffDialog open={openCreate} onClose={() => setOpenCreate(false)} onSubmit={handleCreateStaff} />
      )}

      {selectedStaff && openEdit && (
        <EditStaff
          staff={selectedStaff}
          onClose={() => {
            setOpenEdit(false);
            setSelectedStaff(null);
          }}
          onSave={handleSaveStaff}
        />
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Staff"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        onConfirm={handleDeleteStaff}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
        action="delete"
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
