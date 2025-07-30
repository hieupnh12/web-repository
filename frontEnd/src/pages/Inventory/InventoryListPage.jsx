import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Stack,
  Button,
  IconButton,
  Box,
  Chip,
  Card,
  CardContent,
  Grid,
  Fade,
  Skeleton,
  InputAdornment,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  getInventories, 
  deleteInventory,
  getStaffList,
  getWarehouseAreas 
} from '../../services/inventoryService';
import { takeWarehouseAreaInven } from '../../services/storage';
import { fetchStaffList } from '../../services/staffService';
import { toast } from 'react-toastify';
import DeleteInventoryModal from './components/DeleteInventoryModal';

const InventoryListPage = () => {
  const navigate = useNavigate();

  const [inventory, setInventories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuInventory, setMenuInventory] = useState(null);

  // Enhanced filters
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    staffId: '',
    dateFrom: '',
    dateTo: '',
  });

  const [originalInventories, setOriginalInventories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    applyFilters();
  }, [filters, originalInventories]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching inventory data...");
      
      const [data, areaList, staffList] = await Promise.all([
        getInventories(), 
        takeWarehouseAreaInven(),
        fetchStaffList(),
      ]);

      console.log("📋 Raw inventory data:", data);
      console.log("🏢 Areas data:", areaList);
      console.log("👥 Staff data:", staffList);

      const inventoryData = Array.isArray(data) ? data : [];
      setOriginalInventories(inventoryData);
      setInventories(inventoryData);
      setAreas(Array.isArray(areaList) ? areaList : []);
      setStaffs(Array.isArray(staffList) ? staffList : []);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách kiểm kê:', error);
      toast.error('Không thể tải danh sách kiểm kê');
      setInventories([]);
      setOriginalInventories([]);
      setAreas([]);
      setStaffs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...originalInventories];

    
    if (filters.status) {
      filtered = filtered.filter(inv => inv.status?.toString() === filters.status);
    }

    
    if (filters.staffId) {
      filtered = filtered.filter(inv => inv.createdId?.toString() === filters.staffId);
    }

    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(inv => {
        const inventoryId = (inv.inventoryId || inv.id || '').toString().toLowerCase();
        const staffName = getStaffName(inv.createdId).toLowerCase();
        const areaName = getAreaName(inv.areaId).toLowerCase();
        
        return inventoryId.includes(searchLower) || 
               staffName.includes(searchLower) || 
               areaName.includes(searchLower);
      });
    }

    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(inv => {
        if (!inv.createdAt) return false;
        const invDate = new Date(inv.createdAt);
        return invDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); 
      filtered = filtered.filter(inv => {
        if (!inv.createdAt) return false;
        const invDate = new Date(inv.createdAt);
        return invDate <= toDate;
      });
    }

    setInventories(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      search: '',
      staffId: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 1:
        return {
          text: 'Đang kiểm kê',
          color: 'warning',
          icon: <ScheduleIcon sx={{ fontSize: 16 }} />,
          bgColor: '#fff3e0',
          textColor: '#e65100'
        };
      case 2:
        return {
          text: 'Đã hoàn tất',
          color: 'success',
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
          bgColor: '#e8f5e8',
          textColor: '#2e7d32'
        };
      default:
        return {
          text: 'Không xác định',
          color: 'default',
          icon: null,
          bgColor: '#f5f5f5',
          textColor: '#666'
        };
    }
  };

  const getStaffName = (id) => {
    if (!Array.isArray(staffs)) return `ID: ${id}`;
    const staff = staffs.find((s) => s.id === id || s.staffId === id);
    return staff?.fullName || staff?.name || `ID: ${id}`;
  };
  
  const getAreaName = (id) => {
    if (!Array.isArray(areas)) return 'Toàn kho';
    const area = areas.find((a) => a.id === id);
    return area?.name || 'Toàn kho';
  };

  const handleViewDetails = (inv) => {
    if (inv.status === 1) {
      navigate(`/manager/inventory/details/${inv.inventoryId || inv.id}`);
    } else {
      navigate(`/manager/inventory/summary/${inv.inventoryId || inv.id}`);
    }
  };

  const handleMenuOpen = (event, inventory) => {
    setAnchorEl(event.currentTarget);
    setMenuInventory(inventory);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuInventory(null);
  };

  const handleDeleteClick = (inventory) => {
    setSelectedInventory(inventory);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteSuccess = (deletedInventory) => {
    
    setOriginalInventories(prev => 
      prev.filter(inv => 
        (inv.inventoryId || inv.id) !== (deletedInventory.inventoryId || deletedInventory.id)
      )
    );
    setInventories(prev => 
      prev.filter(inv => 
        (inv.inventoryId || inv.id) !== (deletedInventory.inventoryId || deletedInventory.id)
      )
    );
    setDeleteModalOpen(false);
    setSelectedInventory(null);
  };

  const renderTableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton variant="text" width={80} /></TableCell>
          <TableCell><Skeleton variant="text" width={120} /></TableCell>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
          <TableCell><Skeleton variant="text" width={100} /></TableCell>
          <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
          <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
        </TableRow>
      ))}
    </>
  );

  const statsData = [
    {
      title: 'Tổng phiếu kiểm kê',
      value: originalInventories.length,
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: '#e8eaf6'
    },
    {
      title: 'Đang kiểm kê',
      value: originalInventories.filter(inv => inv.status === 1).length,
      icon: <ScheduleIcon sx={{ fontSize: 32 }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: '#fff3e0'
    },
    {
      title: 'Đã hoàn tất',
      value: originalInventories.filter(inv => inv.status === 2).length,
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: '#e8f5e8'
    }
  ];

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

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
            <BusinessIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Quản lý kiểm kê kho
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Theo dõi và quản lý các phiếu kiểm kê hàng hóa
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/manager/inventory/create')}
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
            Tạo phiếu kiểm kê mới
          </Button>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Fade in={true} timeout={300 + index * 100}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h3" fontWeight="bold" color="primary">
                        {stat.value}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        {stat.title}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        background: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}
      >
        
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon />
              Bộ lọc tìm kiếm
              {hasActiveFilters && (
                <Chip 
                  label={`${Object.values(filters).filter(v => v !== '').length} bộ lọc`}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            
            {hasActiveFilters && (
              <Button
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                size="small"
                sx={{ color: '#666' }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </Box>
          
          <Grid container spacing={2}>

            <Grid item xs={12} md={3}>
              <TextField
                name="search"
                label="Tìm kiếm"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Mã phiếu"
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

   
            {/* <Grid item xs={12} md={2}>
              <TextField
                select
                name="areaId"
                label="Khu vực kho"
                value={filters.areaId}
                onChange={handleFilterChange}
                fullWidth
                size="small"
              >
                <MenuItem value="">Tất cả khu vực</MenuItem>
                {areas.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}

        
            <Grid item xs={12} md={2}>
              <TextField
                select
                name="status"
                label="Trạng thái"
                value={filters.status}
                onChange={handleFilterChange}
                fullWidth
                size="small"
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value="1">Đang kiểm kê</MenuItem>
                <MenuItem value="2">Đã hoàn tất</MenuItem>
              </TextField>
            </Grid>

           
            <Grid item xs={12} md={2}>
              <TextField
                select
                name="staffId"
                label="Nhân viên"
                value={filters.staffId}
                onChange={handleFilterChange}
                fullWidth
                size="small"
              >
                <MenuItem value="">Tất cả nhân viên</MenuItem>
                {staffs.map((staff) => (
                  <MenuItem key={staff.id || staff.staffId} value={staff.id || staff.staffId}>
                    {staff.fullName || staff.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

      
            <Grid item xs={12} md={1.5}>
              <TextField
                name="dateFrom"
                label="Từ ngày"
                type="date"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>


            <Grid item xs={12} md={1.5}>
              <TextField
                name="dateTo"
                label="Đến ngày"
                type="date"
                value={filters.dateTo}
                onChange={handleFilterChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

       
          {hasActiveFilters && (
            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
              <Typography variant="body2">
                Hiển thị <strong>{inventory.length}</strong> kết quả từ tổng số <strong>{originalInventories.length}</strong> phiếu kiểm kê
              </Typography>
            </Alert>
          )}
        </Box>

       
        <Box sx={{ overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.95rem' }}>
                  Mã phiếu
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.95rem' }}>
                  Nhân viên thực hiện
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.95rem' }}>
                  Khu vực kiểm kê
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.95rem' }}>
                  Ngày tạo
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.95rem' }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.95rem', textAlign: 'center' }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                renderTableSkeleton()
              ) : inventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <AssignmentIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {hasActiveFilters ? 'Không tìm thấy kết quả' : 'Chưa có phiếu kiểm kê nào'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hasActiveFilters 
                        ? 'Thử thay đổi bộ lọc để tìm kiếm phiếu kiểm kê khác'
                        : 'Hãy tạo phiếu kiểm kê đầu tiên để bắt đầu'
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((inv, index) => {
                  const statusConfig = getStatusConfig(inv.status);
                  return (
                    <Fade in={true} timeout={300 + index * 50} key={inv.inventoryId || inv.id}>
                      <TableRow
                        hover
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#f0f7ff',
                            transform: 'scale(1.001)'
                          }
                        }}
                      >
                        <TableCell 
                          sx={{ fontWeight: 600, color: '#1976d2' }}
                          onClick={() => handleViewDetails(inv)}
                        >
                          #{inv.inventoryId || inv.id}
                        </TableCell>
                        <TableCell onClick={() => handleViewDetails(inv)}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                color: '#1976d2'
                              }}
                            >
                              {(inv.staffName || getStaffName(inv.createdId)).charAt(0).toUpperCase()}
                            </Box>
                            <Typography variant="body2">
                              {inv.staffName || getStaffName(inv.createdId)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell onClick={() => handleViewDetails(inv)}>
                          <Chip
                            label={getAreaName(inv.areaId)}
                            size="small"
                            sx={{
                              bgcolor: '#e8f5e8',
                              color: '#2e7d32',
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                        <TableCell onClick={() => handleViewDetails(inv)}>
                          <Typography variant="body2" color="text.secondary">
                            {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell onClick={() => handleViewDetails(inv)}>
                          <Chip
                            icon={statusConfig.icon}
                            label={statusConfig.text}
                            size="small"
                            sx={{
                              bgcolor: statusConfig.bgColor,
                              color: statusConfig.textColor,
                              fontWeight: 'bold',
                              border: 'none'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Thêm hành động" arrow>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, inv)}
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
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Footer */}
        {!loading && inventory.length > 0 && (
          <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị {inventory.length} phiếu kiểm kê
              {hasActiveFilters && ` (đã lọc từ ${originalInventories.length} phiếu)`}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={() => handleViewDetails(menuInventory)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem chi tiết</ListItemText>
        </MenuItem>
        
        {menuInventory?.status === 1 && (
          <MenuItem onClick={() => {
            navigate(`/manager/inventory/details/${menuInventory.inventoryId || menuInventory.id}`);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Tiếp tục kiểm kê</ListItemText>
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem 
          onClick={() => handleDeleteClick(menuInventory)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Xóa phiếu kiểm kê</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Modal */}
      <DeleteInventoryModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        inventory={selectedInventory}
        onSuccess={handleDeleteSuccess}
      />
    </Container>
  );
};

export default InventoryListPage;