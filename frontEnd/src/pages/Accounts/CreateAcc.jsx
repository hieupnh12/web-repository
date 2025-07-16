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
} from "@mui/material";
import { fetchStaffList } from "../../services/staffService";

export default function CreateAcc({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    staffId: "",
    userName: "",
    password: "",
    roleId: "",
  });

  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    const loadStaffs = async () => {
      try {
        const res = await fetchStaffList();
        setStaffs(res.data.result || []);
      } catch (err) {
        console.error("Failed to fetch staff list", err);
      }
    };
    loadStaffs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.staffId || !form.userName || !form.password || !form.roleId) {
      alert("Please fill in all fields.");
      return;
    }
    onSubmit(form);
    onClose();
    setForm({ staffId: "", userName: "", password: "", roleId: "" });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="Select Staff"
            name="staffId"
            value={form.staffId}
            onChange={handleChange}
            fullWidth
          >
            {staffs.map((staff) => (
              <MenuItem key={staff.staffId} value={staff.staffId}>
                {staff.fullName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Username"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Role ID"
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
