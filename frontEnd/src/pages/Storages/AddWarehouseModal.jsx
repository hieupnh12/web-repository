import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Switch, FormControlLabel } from "@mui/material";

const AddWarehouseModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    note: "",
    location: "",
    capacity: "",
    status: true,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSwitch = (e) => {
    setForm({ ...form, status: e.target.checked });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Thêm kho mới</DialogTitle>
      <DialogContent>
        <TextField label="Tên" name="name" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Mô tả" name="note" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Vị trí" name="location" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Diện tích" name="capacity" type="number" fullWidth margin="dense" onChange={handleChange} />
        <FormControlLabel control={<Switch checked={form.status} onChange={handleSwitch} />} label="Hoạt động" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">Thêm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWarehouseModal;
