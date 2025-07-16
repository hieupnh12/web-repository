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
import CreateAcc from "./CreateAcc";
import EditAcc from "./EditAcc";
import AccountTable from "./AccountTable";
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../../services/accountService";

const StyledButton = styled(Button)(() => ({
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 500,
  padding: "10px 24px",
  background: "linear-gradient(45deg, #1976d2 30%, #64b5f6 90%)",
  boxShadow: "0 3px 15px rgba(25, 118, 210, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 25px rgba(25, 118, 210, 0.4)",
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    backgroundColor: "white",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 20px rgba(25, 118, 210, 0.2)",
    },
  },
}));

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetchAccounts();
      setAccounts(res?.data?.result || []);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to load accounts", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAccount = async (accountData) => {
    try {
      await createAccount(accountData.staffId, accountData);
      setSnackbar({ open: true, message: "Account created successfully", severity: "success" });
      loadAccounts();
    } catch (err) {
      setSnackbar({ open: true, message: err.toString(), severity: "error" });
    }
  };

  const handleEditAccount = async (updatedData) => {
    try {
      await updateAccount(updatedData.staffId, updatedData);
      setSnackbar({ open: true, message: "Account updated", severity: "success" });
      loadAccounts();
    } catch (err) {
      setSnackbar({ open: true, message: err.toString(), severity: "error" });
    } finally {
      setOpenEdit(false);
      setSelectedAccount(null);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await deleteAccount(selectedId);
      setAccounts((prev) => prev.filter((acc) => acc.staffId !== selectedId));
      setSnackbar({ open: true, message: "Deleted successfully", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.toString(), severity: "error" });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.userName?.toLowerCase().includes(search.toLowerCase()) ||
      acc.roleId?.toString().includes(search)
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <StyledButton variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
          Add Account
        </StyledButton>
        <Box sx={{ display: "flex", width: "40%", alignItems: "center", gap: 1 }}>
          <StyledTextField
            fullWidth
            placeholder="Search by username or role ID..."
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
            <IconButton onClick={loadAccounts} disabled={loading}>
              <RefreshIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <AccountTable
        accounts={filteredAccounts}
        loading={loading}
        onEdit={(acc) => {
          setSelectedAccount(acc);
          setOpenEdit(true);
        }}
        onDelete={(id) => {
          setSelectedId(id);
          setConfirmOpen(true);
        }}
      />

      {/* Dialogs */}
      {openCreate && (
        <CreateAcc open={openCreate} onClose={() => setOpenCreate(false)} onSubmit={handleCreateAccount} />
      )}

      {openEdit && selectedAccount && (
        <EditAcc
          account={selectedAccount}
          onClose={() => {
            setOpenEdit(false);
            setSelectedAccount(null);
          }}
          onSave={handleEditAccount}
        />
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Account"
        message="Are you sure you want to delete this account?"
        onConfirm={handleDeleteAccount}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
        action="delete"
      />

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
