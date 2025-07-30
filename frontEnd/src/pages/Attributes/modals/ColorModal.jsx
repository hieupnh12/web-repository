import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Typography,
  CircularProgress,
  Box,
  Fade,
  Skeleton,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import {
  getAllColors,
  createColor,
  updateColor,
  deleteColor,
} from "../../../services/attributeService";

const ColorModal = ({ open, onClose }) => {
  const [colorName, setColorName] = useState("");
  const [colors, setColors] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const fetchColors = async () => {
    try {
      setLoading(true);
      const res = await getAllColors();
      setColors(res || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách màu sắc:", err);
      showNotification("Lỗi khi lấy danh sách màu sắc", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchColors();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setColorName("");
    setSelectedColorId(null);
  };

  const handleAdd = async () => {
    if (!colorName.trim()) {
      showNotification("Tên màu sắc không được để trống", "warning");
      return;
    }
    try {
      setActionLoading(true);
      await createColor({ name: colorName.trim() });
      await fetchColors();
      resetForm();
      showNotification("Thêm màu sắc thành công", "success");
    } catch (err) {
      console.error("Lỗi khi thêm màu sắc:", err);
      showNotification("Lỗi khi thêm màu sắc", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedColorId) return;
    if (!colorName.trim()) {
      showNotification("Tên màu sắc không được để trống", "warning");
      return;
    }

    try {
      setActionLoading(true);
      await updateColor(selectedColorId, { name: colorName.trim() });
      await fetchColors();
      resetForm();
      showNotification("Cập nhật màu sắc thành công", "success");
    } catch (err) {
      console.error("Lỗi khi cập nhật màu sắc:", err);
      showNotification("Lỗi khi cập nhật màu sắc", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteColor(selectedColorId);
      await fetchColors();
      resetForm();
      showNotification("Xóa màu sắc thành công", "success");
    } catch (err) {
      console.error("Lỗi khi xóa màu sắc:", err);
      showNotification("Lỗi khi xóa màu sắc", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDeleteConfirm = () => {
    if (!selectedColorId) return;
    setConfirmOpen(true);
  };

  const handleRowClick = (color) => {
    setSelectedColorId(color.id);
    setColorName(color.name);
  };

  const handleCancel = () => {
    resetForm();
  };

  const renderTableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton variant="text" width={40} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="80%" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
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
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
            py: 2.5,
            position: "relative",
          }}
        >
          QUẢN LÝ MÀU SẮC
          <Button
            onClick={onClose}
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

        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            height: "70vh",
          }}
        >
          {/* Form Input Section - Fixed */}
          <Box
            sx={{
              p: 3,
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #e0e0e0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" fontWeight="600" mb={2} color="primary">
              {selectedColorId ? "Chỉnh sửa màu sắc" : "Thêm màu sắc mới"}
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="Nhập tên màu sắc"
                size="small"
                disabled={actionLoading}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#fff",
                    },
                  },
                }}
              />

              {/* Action Buttons - Fixed */}
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAdd}
                  disabled={actionLoading || !colorName.trim() || selectedColorId}
                  startIcon={
                    actionLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <AddIcon />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: 120,
                  }}
                >
                  Thêm mới
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                  disabled={actionLoading || !selectedColorId || !colorName.trim()}
                  startIcon={
                    actionLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <EditIcon />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: 120,
                  }}
                >
                  Cập nhật
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleOpenDeleteConfirm}
                  disabled={actionLoading || !selectedColorId}
                  startIcon={
                    actionLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <DeleteIcon />
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: 120,
                  }}
                >
                  Xóa
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={actionLoading}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: 120,
                  }}
                >
                  Hủy
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Table Section - Scrollable */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              backgroundColor: "#fff",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: "#f5f5f5",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      borderBottom: "2px solid #e0e0e0",
                      width: "120px",
                    }}
                  >
                    Mã số
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: "#f5f5f5",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Tên màu sắc
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  renderTableSkeleton()
                ) : colors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="textSecondary">
                        Chưa có màu sắc nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  colors.map((color, index) => (
                    <Fade in={true} timeout={300 + index * 50} key={color.id}>
                      <TableRow
                        hover
                        selected={color.id === selectedColorId}
                        onClick={() => handleRowClick(color)}
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "#f0f7ff",
                            transform: "scale(1.001)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#e3f2fd",
                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: "#1976d2" }}>
                          #{color.id}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.95rem" }}>
                          {color.name}
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>

          {/* Status Bar */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#f8f9fa",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Tổng số: {colors.length} màu sắc
            </Typography>
            {selectedColorId && (
              <Typography variant="body2" color="primary" fontWeight={600}>
                Đã chọn: #{selectedColorId}
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa màu sắc này? Thao tác này không thể hoàn tác."
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          handleDelete();
        }}
      />
    </>
  );
};

export default ColorModal;
