import React, { useState, useEffect } from "react";
import {
  Container, Grid, Typography, Box, Button, IconButton, Snackbar, Alert,
  Card, CardContent, Chip, Fade, Paper, Tooltip, Stack
} from "@mui/material";
import { 
  Add, Edit, Delete, Warehouse, LocationOn, Inventory2, 
  GridView, ViewModule, Map, Business 
} from "@mui/icons-material";
import {
  takeWarehouseArea,
  takeCreateWarehouseArea,
  takeUpdateWarehouseArea,
  takeDeleteWarehouseArea
} from "../../services/storage";
import AddWarehouseModal from "./AddWarehouseModal";
import EditWarehouseModal from "./EditWarehouseModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const WarehousePage = () => {
  const [areas, setAreas] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [areaToEdit, setAreaToEdit] = useState(null);
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await takeWarehouseArea();
      setAreas(res.data || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
      setSnackbar({ open: true, message: "Lỗi khi tải danh sách kho", severity: "error" });
    }
  };

  const handleCreate = async (data) => {
    try {
      await takeCreateWarehouseArea(data);
      setSnackbar({ open: true, message: "Thêm kho thành công", severity: "success" });
      setAddOpen(false);
      fetchAreas();
    } catch (error) {
      setSnackbar({ open: true, message: "Lỗi khi thêm kho", severity: "error" });
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await takeUpdateWarehouseArea(id, data);
      setSnackbar({ open: true, message: "Cập nhật kho thành công", severity: "success" });
      setEditOpen(false);
      fetchAreas();
    } catch (error) {
      setSnackbar({ open: true, message: "Lỗi khi c��p nhật kho", severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await takeDeleteWarehouseArea(areaToDelete.id);
      setSnackbar({ open: true, message: "Xóa kho thành công", severity: "success" });
      setConfirmDeleteOpen(false);
      fetchAreas();
    } catch (error) {
      setSnackbar({ open: true, message: "Lỗi khi xóa kho", severity: "error" });
    }
  };

  const getWarehouseColor = (index) => {
    const colors = [
      { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', light: '#e8eaf6' },
      { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', light: '#fce4ec' },
      { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', light: '#e1f5fe' },
      { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', light: '#e8f5e8' },
      { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', light: '#fff3e0' },
      { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', light: '#f3e5f5' },
      { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', light: '#ffebee' },
      { bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', light: '#f8bbd9' }
    ];
    return colors[index % colors.length];
  };

  const renderGridView = () => (
    <Grid container spacing={3}>
      {areas.map((area, index) => {
        const colorScheme = getWarehouseColor(index);
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={area.id}>
            <Fade in={true} timeout={300 + index * 100}>
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
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    borderColor: 'transparent'
                  }
                }}
              >
                {/* Card Header */}
                <Box
                  sx={{
                    height: 80,
                    background: colorScheme.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderRadius: '12px 12px 0 0',
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
                  <Warehouse sx={{ color: 'white', fontSize: 32 }} />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {String.fromCharCode(65 + index)}
                    </Typography>
                  </Box>
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

                  {area.location && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LocationOn sx={{ fontSize: 16, color: '#666' }} />
                      <Typography variant="body2" color="text.secondary">
                        {area.location}
                      </Typography>
                    </Box>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      minHeight: 40,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2
                    }}
                  >
                    {area.note || 'Không có ghi chú'}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={area.status ? "Hoạt động" : "Tạm dừng"}
                      size="small"
                      sx={{
                        bgcolor: area.status ? '#e8f5e8' : '#ffebee',
                        color: area.status ? '#2e7d32' : '#d32f2f',
                        fontWeight: 'bold',
                        border: `1px solid ${area.status ? '#c8e6c9' : '#ffcdd2'}`
                      }}
                    />
                    {area.capacity && (
                      <Chip
                        label={`${area.capacity}m²`}
                        size="small"
                        sx={{
                          bgcolor: colorScheme.light,
                          color: '#666',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Stack>
                </CardContent>

                {/* Action Buttons */}
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
                </Box>
              </Card>
            </Fade>
          </Grid>
        );
      })}
    </Grid>
  );

  const renderMapView = () => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        p: 4,
        background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)',
        minHeight: 600
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 3, color: '#2c3e50', fontWeight: 'bold' }}>
        <Map sx={{ mr: 1, verticalAlign: 'middle' }} />
        Bản đồ kho hàng
      </Typography>
      
      {/* Warehouse Map Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 3,
          p: 3,
          border: '2px dashed #e0e0e0',
          borderRadius: 2,
          background: 'linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          position: 'relative'
        }}
      >
        {areas.map((area, index) => {
          const colorScheme = getWarehouseColor(index);
          return (
            <Box
              key={area.id}
              sx={{
                position: 'relative',
                background: colorScheme.bg,
                borderRadius: 2,
                p: 2,
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  zIndex: 10
                }
              }}
              onClick={() => {
                setAreaToEdit(area);
                setEditOpen(true);
              }}
            >
              {/* Zone Label */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {String.fromCharCode(65 + index)}
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {area.name}
                </Typography>
                {area.location && (
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    📍 {area.location}
                  </Typography>
                )}
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" gap={1}>
                  <Warehouse sx={{ fontSize: 20 }} />
                  {area.capacity && (
                    <Typography variant="caption">
                      {area.capacity}m²
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: area.status ? '#4caf50' : '#f44336'
                  }}
                />
              </Box>
            </Box>
          );
        })}

        {/* Add New Zone Button */}
        <Box
          onClick={() => setAddOpen(true)}
          sx={{
            border: '2px dashed rgba(0,0,0,0.3)',
            borderRadius: 2,
            p: 2,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minHeight: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.5)',
            '&:hover': {
              borderColor: '#1976d2',
              background: 'rgba(25,118,210,0.1)',
              transform: 'scale(1.02)'
            }
          }}
        >
          <Add sx={{ fontSize: 32, color: '#666', mb: 1 }} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Thêm khu vực mới
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

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
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Business sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Quản lý khu vực kho
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Tổng cộng {areas.length} khu vực kho
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={2}>
            {/* View Mode Toggle */}
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                p: 0.5,
                display: 'flex'
              }}
            >
              <IconButton
                onClick={() => setViewMode('grid')}
                sx={{
                  color: viewMode === 'grid' ? '#1976d2' : 'white',
                  bgcolor: viewMode === 'grid' ? 'white' : 'transparent',
                  '&:hover': { bgcolor: viewMode === 'grid' ? 'white' : 'rgba(255,255,255,0.1)' }
                }}
              >
                <GridView />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('map')}
                sx={{
                  color: viewMode === 'map' ? '#1976d2' : 'white',
                  bgcolor: viewMode === 'map' ? 'white' : 'transparent',
                  '&:hover': { bgcolor: viewMode === 'map' ? 'white' : 'rgba(255,255,255,0.1)' }
                }}
              >
                <Map />
              </IconButton>
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
              Thêm khu vực
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Content */}
      {areas.length === 0 ? (
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
              Thêm khu vực đầu tiên
            </Button>
          </Paper>
        </Fade>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderMapView()
      )}

      {/* Modals */}
      <AddWarehouseModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleCreate} />
      <EditWarehouseModal open={editOpen} onClose={() => setEditOpen(false)} area={areaToEdit} onSubmit={handleUpdate} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="Xác nhận xóa khu vực kho"
        content={`Bạn có chắc chắn muốn xóa khu vực "${areaToDelete?.name}"? Thao tác này không thể hoàn tác.`}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => {
          setConfirmDeleteOpen(false);
          handleDelete();
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            borderRadius: 2,
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WarehousePage;