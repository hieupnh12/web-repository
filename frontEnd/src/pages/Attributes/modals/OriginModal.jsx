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
  Divider,
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
  getAllOrigins,
  createOrigin,
  updateOrigin,
  deleteOrigin,
} from "../../../services/attributeService";

const OriginModal = ({ open, onClose }) => {
  const [originName, setOriginName] = useState("");
  const [origins, setOrigins] = useState([]);
  const [selectedOriginId, setSelectedOriginId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchOrigins = async () => {
    try {
      setLoading(true);
      const res = await getAllOrigins();
      setOrigins(res || []);
    } catch (err) {
      showNotification("Lỗi khi lấy danh sách xuất xứ", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOrigins();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setOriginName("");
    setSelectedOriginId(null);
  };

  const handleAdd = async () => {
    if (!originName.trim()) {
      showNotification("Tên xuất xứ không được để trống", "warning");
      return;
    }

    try {
      setActionLoading(true);
      await createOrigin({
        name: originName.trim(),
      });
      await fetchOrigins();
      resetForm();
      showNotification("Thêm xuất xứ thành công", "success");
    } catch (err) {
      showNotification("Lỗi khi thêm xuất xứ", "error");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedOriginId) return;
    if (!originName.trim()) {
      showNotification("Tên xuất xứ không được để trống", "warning");
      return;
    }

    try {
      setActionLoading(true);
      await updateOrigin(selectedOriginId, { name: originName.trim() });
      await fetchOrigins();
      resetForm();
      showNotification("Cập nhật xuất xứ thành công", "success");
    } catch (err) {
      showNotification("Lỗi khi cập nhật xuất xứ", "error");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteOrigin(selectedOriginId);
      await fetchOrigins();
      resetForm();
      showNotification("Xóa xuất xứ thành công", "success");
    } catch (err) {
      showNotification("Lỗi khi xóa xuất xứ", "error");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDeleteConfirm = () => {
    if (!selectedOriginId) return;
    setConfirmOpen(true);
  };

  const handleRowClick = (origin) => {
    setSelectedOriginId(origin.id);
    setOriginName(origin.name);
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
          QUẢN LÝ XUẤT XỨ
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
              {selectedOriginId
                ? "Chỉnh sửa xuất xứ"
                : "Thêm xuất xứ mới"}
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                value={originName}
                onChange={(e) => setOriginName(e.target.value)}
                placeholder="Nhập tên xuất xứ"
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
                  disabled={
                    actionLoading || !originName.trim() || selectedOriginId
                  }
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
                  disabled={
                    actionLoading || !selectedOriginId || !originName.trim()
                  }
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
                  disabled={actionLoading || !selectedOriginId}
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
                    Tên xuất xứ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  renderTableSkeleton()
                ) : origins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="textSecondary">
                        Chưa có xuất xứ nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  origins.map((origin, index) => (
                    <Fade
                      in={true}
                      timeout={300 + index * 50}
                      key={origin.id}
                    >
                      <TableRow
                        hover
                        selected={origin.id === selectedOriginId}
                        onClick={() => handleRowClick(origin)}
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
                          #{origin.id}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.95rem" }}>
                          {origin.name}
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
              Tổng số: {origins.length} xuất xứ
            </Typography>
            {selectedOriginId && (
              <Typography variant="body2" color="primary" fontWeight={600}>
                Đã chọn: #{selectedOriginId}
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
        content="Bạn có chắc chắn muốn xóa xuất xứ này? Thao tác này không thể hoàn tác."
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          handleDelete();
        }}
      />
    </>
  );
};

export default OriginModal;