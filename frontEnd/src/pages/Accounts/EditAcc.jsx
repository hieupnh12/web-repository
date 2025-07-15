import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function EditAcc({ account, onClose, onSave }) {
  const [form, setForm] = useState(account);

  useEffect(() => {
    setForm(account);
  }, [account]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.staffId || !form.userName || !form.roleId) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave(form);
  };

  return (
    <Dialog open={Boolean(account)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Staff ID"
            name="staffId"
            value={form.staffId}
            onChange={handleChange}
            fullWidth
            disabled
          />
          <TextField
            label="Username"
            name="userName"
            value={form.userName}
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
