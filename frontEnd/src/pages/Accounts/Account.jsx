// Account.jsx - Đã cập nhật theo yêu cầu
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

import CreateAcc from "./CreateAcc";
import EditAcc from "./EditAcc";
import AccountTable from "./AccountTable";
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  fetchRoles,
} from "../../services/accountService";

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

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

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
      setSnackbar({ open: true, message: "Không tải được tài khoản", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
    fetchRoles().then((res) => setRoles(res?.data?.result || []));
  }, []);

  const handleEditAccount = async (updatedData) => {
    try {
      await updateAccount(selectedAccount.staffId, {
        userName: updatedData.userName,
        roleId: parseInt(updatedData.roleId, 10),
        status: updatedData.status,
      });
      setSnackbar({ open: true, message: "Cập nhật thành công", severity: "success" });
      loadAccounts();
    } catch (err) {
      setSnackbar({ open: true, message: err?.response?.data?.message || "Lỗi cập nhật", severity: "error" });
    } finally {
      setOpenEdit(false);
      setSelectedAccount(null);
    }
  };

  const filtered = accounts.filter(
    (acc) =>
      acc.userName?.toLowerCase().includes(search.toLowerCase()) ||
      acc.roleName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <StyledButton variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
          Thêm tài khoản
        </StyledButton>
        <Box sx={{ display: "flex", width: "40%", alignItems: "center", gap: 1 }}>
          <StyledTextField
            fullWidth
            placeholder="Tìm kiếm theo tên đăng nhập hoặc vai trò..."
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
          <Tooltip title="Tải lại">
            <IconButton onClick={loadAccounts} disabled={loading}>
              <RefreshIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Table */}
      <AccountTable
        accounts={filtered}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={(e, newPage) => setPage(newPage)}
        handleChangeRowsPerPage={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        handleEdit={(acc) => {
          setSelectedAccount(acc);
          setOpenEdit(true);
        }}
      />

      {/* Create Dialog */}
      {openCreate && (
        <CreateAcc
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSuccess={(newAcc) => {
            if (newAcc) {
              setAccounts((prev) => [newAcc, ...prev]);
              setSnackbar({ open: true, message: "Tạo tài khoản thành công", severity: "success" });
              setPage(0);
            }
          }}
          accounts={accounts}
          roles={roles}
        />
      )}

      {/* Edit Dialog */}
      {openEdit && selectedAccount && (
        <EditAcc
          account={selectedAccount}
          roles={roles}
          onClose={() => {
            setOpenEdit(false);
            setSelectedAccount(null);
          }}
          onSave={handleEditAccount}
        />
      )}

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
