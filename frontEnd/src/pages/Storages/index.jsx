import React, { useState, useEffect } from "react";
import {
  Container, Grid, Typography, Box, Button, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Card, CardContent, CardActions, Chip, Fade, Grow, Paper, Tooltip
} from "@mui/material";
import { Add, Edit, Delete, Warehouse, Inventory2 } from "@mui/icons-material";
import {
  takeWarehouseArea,
  takeCreateWarehouseArea,
  takeUpdateWarehouseArea,
  takeDeleteWarehouseArea
} from "../../services/storage";
import AddWarehouseModal from "./AddWarehouseModal";
import EditWarehouseModal from "./EditWarehouseModal";

const WarehousePage = () => {
  const [areas, setAreas] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [areaToEdit, setAreaToEdit] = useState(null);
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    const res = await takeWarehouseArea();
    setAreas(res.data || []);
  };

  const handleCreate = async (data) => {
    await takeCreateWarehouseArea(data);
    setSnackbar({ open: true, message: "Thêm kho thành công", severity: "success" });
    setAddOpen(false);
    fetchAreas();
  };

  const handleUpdate = async (id, data) => {
    await takeUpdateWarehouseArea(id, data);
    setSnackbar({ open: true, message: "Cập nhật kho thành công", severity: "success" });
    setEditOpen(false);
    fetchAreas();
  };

  const handleDelete = async () => {
    await takeDeleteWarehouseArea(areaToDelete.id);
    setSnackbar({ open: true, message: "Đã xoá kho", severity: "success" });
    setConfirmDeleteOpen(false);
    fetchAreas();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Warehouse sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Quản lý kho
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Danh sách khu vực kho ({areas.length} khu vực)
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => setAddOpen(true)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Thêm kho mới
          </Button>
        </Box>
      </Paper>

      {/* Warehouse Cards Grid */}
      <Grid container spacing={3}>
        {areas.map((area, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={area.id}>
            <Grow in={true} timeout={300 + index * 100}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: '#667eea'
                  }
                }}
              >
                {/* Card Header */}
                <Box
                  sx={{
                    height: 60,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                    }
                  }}
                >
                  <Inventory2 sx={{ color: 'white', fontSize: 28 }} />
                </Box>

                <CardContent sx={{ p: 3, flex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      color: '#2c3e50',
                      fontSize: '1.1rem',
                      mb: 1
                    }}
                  >
                    {area.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      minHeight: 40,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {area.note || 'Không có ghi chú'}
                  </Typography>

                  <Box mt={2}>
                    <Chip
                      label="Đang hoạt động"
                      size="small"
                      sx={{
                        bgcolor: '#e8f5e8',
                        color: '#2e7d32',
                        fontWeight: 'bold',
                        border: '1px solid #c8e6c9'
                      }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="Chỉnh sửa kho" arrow>
                    <IconButton
                      onClick={() => {
                        setAreaToEdit(area);
                        setEditOpen(true);
                      }}
                      sx={{
                        bgcolor: '#e3f2fd',
                        color: '#1976d2',
                        '&:hover': {
                          bgcolor: '#bbdefb',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa kho" arrow>
                    <IconButton
                      onClick={() => {
                        setAreaToDelete(area);
                        setConfirmDeleteOpen(true);
                      }}
                      sx={{
                        bgcolor: '#ffebee',
                        color: '#d32f2f',
                        '&:hover': {
                          bgcolor: '#ffcdd2',
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grow>
          </Grid>
        ))}

        {/* Empty State */}
        {areas.length === 0 && (
          <Grid item xs={12}>
            <Fade in={true}>
              <Paper
                elevation={0}
                sx={{
                  textAlign: 'center',
                  py: 8,
                  borderRadius: 3,
                  border: '2px dashed #e0e0e0',
                  background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)'
                }}
              >
                <Warehouse sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Chưa có khu vực kho nào
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Hãy thêm khu vực kho đầu tiên để bắt đầu quản lý
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddOpen(true)}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Thêm kho đầu tiên
                </Button>
              </Paper>
            </Fade>
          </Grid>
        )}
      </Grid>

      {/* Modals */}
      <AddWarehouseModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleCreate} />
      <EditWarehouseModal open={editOpen} onClose={() => setEditOpen(false)} area={areaToEdit} onSubmit={handleUpdate} />

      {/* Enhanced Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: '#ffebee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Delete sx={{ color: '#d32f2f' }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Xác nhận xoá kho
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hành động này không thể hoàn tác
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xoá kho <strong>"{areaToDelete?.name}"</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: '#e0e0e0',
              color: '#666',
              '&:hover': {
                borderColor: '#bdbdbd',
                bgcolor: '#f5f5f5'
              }
            }}
          >
            Hủy
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff5252 0%, #d63031 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Xoá kho
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            borderRadius: 2,
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': {
              fontSize: '24px'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WarehousePage;