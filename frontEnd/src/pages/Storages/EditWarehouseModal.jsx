import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Switch, FormControlLabel } from "@mui/material";

const EditWarehouseModal = ({ open, onClose, area, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    note: "",
    location: "",
    capacity: "",
    status: true,
  });

  useEffect(() => {
    if (area) {
      setForm({
        name: area.name,
        note: area.note || "",
        location: area.location || "",
        capacity: area.capacity || "",
        status: area.status,
      });
    }
  }, [area]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSwitch = (e) => {
    setForm({ ...form, status: e.target.checked });
  };

  const handleSubmit = () => {
    onSubmit(area.id, form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Cập nhật kho</DialogTitle>
      <DialogContent>
        <TextField label="Tên" name="name" fullWidth margin="dense" value={form.name} onChange={handleChange} />
        <TextField label="Mô tả" name="note" fullWidth margin="dense" value={form.note} onChange={handleChange} />
        <TextField label="Vị trí" name="location" fullWidth margin="dense" value={form.location} onChange={handleChange} />
        <TextField label="Diện tích" name="capacity" type="number" fullWidth margin="dense" value={form.capacity} onChange={handleChange} />
        <FormControlLabel control={<Switch checked={form.status} onChange={handleSwitch} />} label="Hoạt động" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">Cập nhật</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWarehouseModal;
