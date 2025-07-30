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
  getAllRAMs,
  createRAM,
  updateRAM,
  deleteRAM,
} from "../../../services/attributeService";

const RAMModal = ({ open, onClose }) => {
  const [ramName, setRAMName] = useState("");
  const [rams, setRAMs] = useState([]);
  const [selectedRAMId, setSelectedRAMId] = useState(null);
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

  const fetchRAMs = async () => {
    try {
      setLoading(true);
      const res = await getAllRAMs();
      setRAMs(res || []);
    } catch (err) {
      showNotification("Lỗi khi lấy danh sách RAM", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRAMs();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setRAMName("");
    setSelectedRAMId(null);
  };

  const handleAdd = async () => {
    if (!ramName.trim()) {
      showNotification("Tên RAM không được để trống", "warning");
      return;
    }

    try {
      setActionLoading(true);
      await createRAM({
        name: ramName.trim(),
      });
      await fetchRAMs();
      resetForm();
      showNotification("Thêm RAM thành công", "success");
    } catch (err) {
      showNotification("Lỗi khi thêm RAM", "error");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedRAMId) return;
    if (!ramName.trim()) {
      showNotification("T��n RAM không được để trống", "warning");
      return;
    }

    try {
      setActionLoading(true);
      await updateRAM(selectedRAMId, { name: ramName.trim() });
      await fetchRAMs();
      resetForm();
      showNotification("Cập nhật RAM thành công", "success");
    } catch (err) {
      showNotification("Lỗi khi cập nhật RAM", "error");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteRAM(selectedRAMId);
      await fetchRAMs();
      resetForm();
      showNotification("Xóa RAM thành công", "success");
    } catch (err) {
      showNotification("Lỗi khi xóa RAM", "error");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDeleteConfirm = () => {
    if (!selectedRAMId) return;
    setConfirmOpen(true);
  };

  const handleRowClick = (ram) => {
    setSelectedRAMId(ram.ram_id);
    setRAMName(ram.name);
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
          QUẢN LÝ RAM
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
              {selectedRAMId
                ? "Chỉnh sửa RAM"
                : "Thêm RAM mới"}
            </Typography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                value={ramName}
                onChange={(e) => setRAMName(e.target.value)}
                placeholder="Nhập tên RAM"
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
                    actionLoading || !ramName.trim() || selectedRAMId
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
                    actionLoading || !selectedRAMId || !ramName.trim()
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
                  disabled={actionLoading || !selectedRAMId}
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
                    Tên RAM
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  renderTableSkeleton()
                ) : rams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="textSecondary">
                        Chưa có RAM nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rams.map((ram, index) => (
                    <Fade
                      in={true}
                      timeout={300 + index * 50}
                      key={ram.ram_id}
                    >
                      <TableRow
                        hover
                        selected={ram.ram_id === selectedRAMId}
                        onClick={() => handleRowClick(ram)}
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
                          #{ram.ram_id}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.95rem" }}>
                          {ram.name}
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
              Tổng số: {rams.length} RAM
            </Typography>
            {selectedRAMId && (
              <Typography variant="body2" color="primary" fontWeight={600}>
                Đã chọn: #{selectedRAMId}
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
        content="Bạn có chắc chắn muốn xóa RAM này? Thao tác này không thể hoàn tác."
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          handleDelete();
        }}
      />
    </>
  );
};

export default RAMModal;