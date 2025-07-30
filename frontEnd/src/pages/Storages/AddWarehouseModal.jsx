import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Stack,
  Alert,
  InputAdornment,
  Divider
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Warehouse,
  LocationOn,
  Notes,
  SquareFoot
} from "@mui/icons-material";
import { toast } from "react-toastify";

const AddWarehouseModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    note: "",
    location: "",
    capacity: "",
    status: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSwitch = (e) => {
    setForm({ ...form, status: e.target.checked });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Tên khu vực là bắt buộc";
    }
    
    if (form.capacity && (isNaN(form.capacity) || Number(form.capacity) <= 0)) {
      newErrors.capacity = "Diện tích phải là số dương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...form,
        capacity: form.capacity ? Number(form.capacity) : null
      });
      
      // Reset form
      setForm({
        name: "",
        note: "",
        location: "",
        capacity: "",
        status: true,
      });
      setErrors({});
      toast.success("Thêm khu vực kho thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm khu vực kho");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      note: "",
      location: "",
      capacity: "",
      status: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.5rem",
          py: 2.5,
          position: "relative",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <Warehouse sx={{ fontSize: 28 }} />
          THÊM KHU VỰC KHO MỚI
        </Box>
        <Button
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#fff",
            minWidth: "auto",
            p: 1,
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Thêm thông tin khu vực kho mới để quản lý hiệu quả hơn
          </Alert>

          <Stack spacing={3}>
            {/* Tên khu vực */}
            <Box>
              <Typography variant="subtitle1" fontWeight="600" mb={1} color="primary">
                Thông tin cơ bản
              </Typography>
              <TextField
                fullWidth
                label="Tên khu vực"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="Ví dụ: Kho A, Khu vực 1, Tầng 2..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Warehouse sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Divider />

            {/* Vị trí và diện tích */}
            <Box>
              <Typography variant="subtitle1" fontWeight="600" mb={2} color="primary">
                Thông tin chi tiết
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Vị trí"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ví dụ: Tầng 1, Phòng A101, Góc phải..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Diện tích"
                  name="capacity"
                  type="number"
                  value={form.capacity}
                  onChange={handleChange}
                  error={!!errors.capacity}
                  helperText={errors.capacity}
                  placeholder="Nhập diện tích (m²)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SquareFoot sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" color="text.secondary">
                          m²
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Ghi chú"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Mô tả thêm về khu vực kho..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <Notes sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Stack>
            </Box>

            <Divider />

            {/* Trạng thái */}
            <Box>
              <Typography variant="subtitle1" fontWeight="600" mb={2} color="primary">
                Trạng thái hoạt động
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.status}
                    onChange={handleSwitch}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4caf50',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4caf50',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="500">
                      {form.status ? "Đang hoạt động" : "Tạm dừng"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {form.status 
                        ? "Khu vực có thể sử dụng để lưu trữ hàng hóa" 
                        : "Khu vực tạm thời không sử dụng"
                      }
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start' }}
              />
            </Box>
          </Stack>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                borderColor: '#e0e0e0',
                color: '#666',
                '&:hover': {
                  borderColor: '#bdbdbd',
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? null : <AddIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                },
                '&:disabled': {
                  background: '#ccc'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isSubmitting ? "Đang thêm..." : "Thêm khu vực"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddWarehouseModal;