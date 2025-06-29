import React, { useState, useEffect } from 'react';
import { 
  takeWarehouseArea, 
  takeWarehouseAreaById
} from '../../services/storage';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  IconButton,
  Chip,
  Skeleton,
  Badge,
  Fade,
  Zoom,
  Avatar,
  Divider,
  Paper,
  Container,
  CardActionArea
} from '@mui/material';
import { 
  Info, 
  Close, 
  Warehouse,
  Inventory,
  CheckCircle,
  Cancel,
  ViewModule,
  TrendingUp,
  Category
} from '@mui/icons-material';

const WarehouseAreaPage = () => {
  const [warehouseAreas, setWarehouseAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch all warehouse areas on component mount
  useEffect(() => {
    fetchWarehouseAreas();
  }, []);

  const fetchWarehouseAreas = async () => {
    try {
      setLoading(true);
      const response = await takeWarehouseArea();
      setWarehouseAreas(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Không thể tải danh sách khu vực kho', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouseAreaDetails = async (id) => {
    try {
      setLoading(true);
      const response = await takeWarehouseAreaById(id);
      setSelectedArea(response.data);
      setOpenDetailDialog(true);
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Không thể tải chi tiết khu vực kho', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedArea(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Helper function to get total products count
  const getTotalProducts = () => {
    return warehouseAreas.reduce((total, area) => {
      return total + (area.products?.length || 0);
    }, 0);
  };

  // Helper function to get active areas count
  const getActiveAreas = () => {
    return warehouseAreas.filter(area => area.status).length;
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item}>
          <Card sx={{ height: '280px' }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" height={80} sx={{ mt: 2, mb: 2 }} />
              <Skeleton variant="rectangular" height={36} width="50%" sx={{ mx: 'auto' }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
            <Warehouse fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold">
              Quản lý khu vực kho
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Theo dõi và quản lý tất cả khu vực lưu trữ
            </Typography>
          </Box>
        </Box>
        
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewModule sx={{ mr: 2, fontSize: 40, color: '#fff' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {warehouseAreas.length}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Tổng khu vực
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 2, fontSize: 40, color: '#4caf50' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {getActiveAreas()}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Đang hoạt động
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory sx={{ mr: 2, fontSize: 40, color: '#ff9800' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="white">
                    {getTotalProducts()}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Tổng sản phẩm
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {loading && renderSkeleton()}

      {/* Warehouse Areas Grid */}
      {!loading && (
        <Fade in={true} timeout={800}>
          <Grid container spacing={3}>
            {warehouseAreas.map((area, index) => (
              <Grid item xs={12} sm={6} md={4} key={area.id}>
                <Zoom in={true} timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {/* Status overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: area.status 
                          ? 'linear-gradient(90deg, #4caf50, #8bc34a)' 
                          : 'linear-gradient(90deg, #f44336, #ff5722)'
                      }}
                    />
                    
                    <CardActionArea onClick={() => fetchWarehouseAreaDetails(area.id)}>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                mr: 2, 
                                bgcolor: area.status ? 'success.main' : 'error.main',
                                width: 48,
                                height: 48
                              }}
                            >
                              {area.status ? <CheckCircle /> : <Cancel />}
                            </Avatar>
                            <Box>
                              <Typography 
                                variant="h6" 
                                component="div" 
                                fontWeight="bold"
                                sx={{ 
                                  fontSize: '1.1rem',
                                  lineHeight: 1.2,
                                  mb: 0.5
                                }}
                              >
                                {area.name}
                              </Typography>
                              <Chip
                                size="small"
                                label={area.status ? 'Hoạt động' : 'Không hoạt động'}
                                color={area.status ? 'success' : 'error'}
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </Box>
                          </Box>
                        </Box>
                        
                        {/* Description */}
                        <Box 
                          sx={{ 
                            bgcolor: 'grey.50', 
                            p: 2, 
                            borderRadius: 2, 
                            mb: 3,
                            minHeight: '60px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontStyle: area.note ? 'normal' : 'italic',
                              lineHeight: 1.4
                            }}
                          >
                            {area.note || 'Không có mô tả'}
                          </Typography>
                        </Box>
                        
                        {/* Products Info */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Category sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              Sản phẩm
                            </Typography>
                          </Box>
                          <Badge 
                            badgeContent={area.products?.length || 0} 
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                fontSize: '0.75rem',
                                height: '20px',
                                minWidth: '20px'
                              }
                            }}
                          >
                            <Inventory color="action" />
                          </Badge>
                        </Box>

                        <Divider sx={{ my: 2 }} />
                        
                        {/* Action Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Button 
                            variant="contained"
                            startIcon={<Info />}
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchWarehouseAreaDetails(area.id);
                            }}
                            sx={{ 
                              minWidth: '140px',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 'bold',
                              py: 1,
                              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                                transform: 'scale(1.05)'
                              }
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}

      {/* Empty State */}
      {!loading && warehouseAreas.length === 0 && (
        <Paper 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            mt: 4,
            borderRadius: 3,
            bgcolor: 'grey.50'
          }}
        >
          <Warehouse sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Chưa có khu vực kho nào
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hệ thống chưa có dữ liệu khu vực kho để hiển thị
          </Typography>
        </Paper>
      )}

      {/* Enhanced Details Dialog */}
      <Dialog 
        open={openDetailDialog} 
        onClose={handleCloseDetailDialog} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Inventory />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {selectedArea?.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Danh sách sản phẩm trong kho
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={handleCloseDetailDialog}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedArea?.products?.length > 0 ? (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {selectedArea.products.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Zoom in={true} timeout={400} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        {/* Product Image */}
                        <Box sx={{ 
                          width: '100%', 
                          height: '180px', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              style={{ 
                                maxWidth: '90%', 
                                maxHeight: '90%', 
                                objectFit: 'contain',
                                borderRadius: '8px'
                              }} 
                            />
                          ) : (
                            <Box sx={{ textAlign: 'center' }}>
                              <Inventory sx={{ fontSize: 60, color: 'grey.400', mb: 1 }} />
                              <Typography variant="body2" color="grey.500">
                                Không có hình ảnh
                              </Typography>
                            </Box>
                          )}
                          
                          {/* Quantity Badge */}
                          <Chip
                            label={`SL: ${product.quantity}`}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              bgcolor: 'primary.main',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                        
                        {/* Product Info */}
                        <Box sx={{ p: 2 }}>
                          <Typography 
                            variant="h6" 
                            align="center" 
                            sx={{ 
                              mb: 1, 
                              fontWeight: 'bold',
                              fontSize: '1rem',
                              lineHeight: 1.3
                            }}
                          >
                            {product.name}
                          </Typography>
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <TrendingUp sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: 'primary.main'
                              }}
                            >
                              Số lượng: {product.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper 
              sx={{ 
                textAlign: 'center', 
                py: 6,
                bgcolor: 'grey.50',
                borderRadius: 2
              }}
            >
              <Inventory sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Khu vực này chưa có sản phẩm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chưa có sản phẩm nào được lưu trữ trong khu vực này
              </Typography>
            </Paper>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 24
            }
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WarehouseAreaPage;