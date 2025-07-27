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
  Tooltip
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getInventories } from '../../services/inventoryService';
import { takeWarehouseAreaInven } from '../../services/storage';
import { fetchStaffList } from '../../services/staffService';
import { toast } from 'react-toastify';

const InventoryListPage = () => {
  const navigate = useNavigate();

  const [inventory, setInventories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    areaId: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [data, areaList, staffList] = await Promise.all([
        getInventories(filters),
        takeWarehouseAreaInven(),
        fetchStaffList(),
      ]);

      setInventories(Array.isArray(data) ? data : []);
      setAreas(Array.isArray(areaList) ? areaList : []);
      setStaffs(Array.isArray(staffList) ? staffList : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách kiểm kê:', error);
      toast.error('Không thể tải danh sách kiểm kê');
      setInventories([]);
      setAreas([]);
      setStaffs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
      value: inventory.length,
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: '#e8eaf6'
    },
    {
      title: 'Đang kiểm kê',
      value: inventory.filter(inv => inv.status === 1).length,
      icon: <ScheduleIcon sx={{ fontSize: 32 }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: '#fff3e0'
    },
    {
      title: 'Đã hoàn tất',
      value: inventory.filter(inv => inv.status === 2).length,
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: '#e8f5e8'
    }
  ];

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
            Tạo phiếu kiểm kê
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

      {/* Main Content */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}
      >
        {/* Filters */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold' }}>
            <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Bộ lọc tìm kiếm
          </Typography>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              select
              name="areaId"
              label="Khu vực kho"
              value={filters.areaId}
              onChange={handleFilterChange}
              sx={{ minWidth: 200 }}
              size="small"
            >
              <MenuItem value="">Tất cả khu vực</MenuItem>
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              name="status"
              label="Trạng thái"
              value={filters.status}
              onChange={handleFilterChange}
              sx={{ minWidth: 180 }}
              size="small"
            >
              <MenuItem value="">Tất cả trạng thái</MenuItem>
              <MenuItem value="1">Đang kiểm kê</MenuItem>
              <MenuItem value="2">Đã hoàn tất</MenuItem>
            </TextField>

            <TextField
              name="search"
              label="Tìm kiếm"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Tìm theo mã phiếu hoặc nhân viên..."
              sx={{ flexGrow: 1 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Box>

        {/* Table */}
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
                      Chưa có phiếu kiểm kê nào
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hãy tạo phiếu kiểm kê đầu tiên để bắt đầu
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
                        onClick={() => handleViewDetails(inv)}
                      >
                        <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>
                          #{inv.inventoryId || inv.id}
                        </TableCell>
                        <TableCell>
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
                              {getStaffName(inv.createdId).charAt(0).toUpperCase()}
                            </Box>
                            <Typography variant="body2">
                              {getStaffName(inv.createdId)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
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
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
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
                          <Tooltip title="Xem chi tiết" arrow>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(inv);
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
                              <VisibilityIcon fontSize="small" />
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
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default InventoryListPage;