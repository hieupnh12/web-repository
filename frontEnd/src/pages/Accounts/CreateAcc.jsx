import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { fetchStaffList } from "../../services/staffService";
import { createAccount } from "../../services/accountService";

export default function CreateAcc({ open, onClose, onSuccess, accounts = [], roles = [] }) {
  const [form, setForm] = useState({
    staffId: "",
    userName: "",
    password: "",
    roleId: "",
  });

  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    if (open) {
      setForm({
        staffId: "",
        userName: "",
        password: "",
        roleId: "",
      });

      const loadData = async () => {
        try {
          const staffRes = await fetchStaffList();
          setStaffs(staffRes.data.result || []);
        } catch (err) {
          console.error("Lỗi tải danh sách nhân viên:", err);
        }
      };

      loadData();
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { staffId, userName, password, roleId } = form;
    if (!staffId || !userName || !password || !roleId) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const res = await createAccount(staffId, {
        userName,
        password,
        roleId: parseInt(roleId, 10),
      });

      if (res.status === 200) {
        onSuccess?.();
        onClose();
        setForm({ staffId: "", userName: "", password: "", roleId: "" });
      }
    } catch (err) {
      console.error("Tạo tài khoản thất bại:", err.response?.data || err);
      alert("Tạo tài khoản thất bại: " + (err.response?.data?.message || ""));
    }
  };

  // Chỉ hiện nhân viên chưa có tài khoản
  const availableStaffs = staffs.filter(
    (staff) => !accounts.some((acc) => acc.staffId === staff.staffId)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          background: "linear-gradient(to right, #16a34a, #4ade80)",
          color: "white",
          p: 2,
          position: "relative",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              p: 1.5,
              display: "flex",
            }}
          >
            <PersonAddIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Tạo Tài Khoản Mới
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Vui lòng điền đầy đủ thông tin cần thiết
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "rgba(255,255,255,0.8)",
            "&:hover": { color: "white" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers sx={{ p: 3 }}>
        <Stack spacing={3}>
          <TextField
            select
            label="Nhân viên"
            name="staffId"
            value={form.staffId}
            onChange={handleChange}
            fullWidth
            required
          >
            {availableStaffs.map((staff) => (
              <MenuItem key={staff.staffId} value={staff.staffId}>
                {staff.fullName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Tên đăng nhập"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            select
            label="Vai trò"
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            fullWidth
            required
          >
            {roles.map((role) => (
              <MenuItem key={role.roleId} value={role.roleId}>
                {role.roleName}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #16a34a, #4ade80)",
            color: "white",
            "&:hover": {
              background: "linear-gradient(to right, #15803d, #22c55e)",
            },
          }}
        >
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
