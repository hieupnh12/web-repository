// Account.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify"; // ✅ dùng toast thay Snackbar
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EditAcc from "./EditAcc";
import AccountTable from "./AccountTable";
import {
  fetchAccounts,
  updateAccount,
  deleteAccount,
  fetchRoles,
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
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetchAccounts();
      setAccounts(res?.data?.result || []);
    } catch (err) {
      toast.error("Không tải được danh sách tài khoản.");
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
      toast.success("Cập nhật tài khoản thành công!");
      loadAccounts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi cập nhật tài khoản.");
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
      toast.success("Xoá tài khoản thành công!");
    } catch (err) {
      toast.error("Lỗi khi xoá tài khoản: " + err.toString());
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.userName?.toLowerCase().includes(search.toLowerCase()) ||
      acc.roleName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
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

      <AccountTable
        accounts={filteredAccounts}
        loading={loading}
        onEdit={(acc) => {
          setSelectedAccount(acc);
          setOpenEdit(true);
        }}
        onDeleteRequest={(id) => {
          setSelectedId(id);
          setConfirmOpen(true);
        }}
      />

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

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Xoá tài khoản"
        message="Bạn có chắc muốn xoá tài khoản này không?"
        onConfirm={handleDeleteAccount}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
        action="delete"
      />
    </Container>
  );
}
