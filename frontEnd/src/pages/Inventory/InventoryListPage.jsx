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
  Button,
  IconButton,
  Box,
  Chip,
  Card,
  CardContent,  
  Grid,
  Fade,
  Skeleton,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  TablePagination,
  Avatar,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
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

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);

  // Filters
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
    setPage(0); // Reset to first page when filtering
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const renderTableSkeleton = () => (
    <>
      {[...Array(rowsPerPage)].map((_, index) => (
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
      title: 'Tổng số',
      value: originalInventories.length,
      icon: <AssignmentIcon sx={{ fontSize: 20 }} />,
      color: '#1976d2',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Đang kiểm kê',
      value: originalInventories.filter(inv => inv.status === 1).length,
      icon: <ScheduleIcon sx={{ fontSize: 20 }} />,
      color: '#ed6c02',
      bgColor: '#fff3e0'
    },
    {
      title: 'Đã hoàn tất',
      value: originalInventories.filter(inv => inv.status === 2).length,
      icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
      color: '#2e7d32',
      bgColor: '#e8f5e8'
    }
  ];

  // Pagination logic
  const paginatedInventory = inventory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
        {/* Header Section - Compact */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            p: 2,
            mb: 2,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <BusinessIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Quản lý kiểm kê kho
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Theo dõi và quản lý các phiếu kiểm kê hàng hóa
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/manager/inventory/create')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 2,
                px: 2,
                py: 1,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Tạo phiếu kiểm kê mới
            </Button>
          </Box>
        </Paper>

        {/* Statistics and Filters Row */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Statistics - Left Half */}
          <Grid item xs={6}>
            <Grid container spacing={1}>
              {statsData.map((stat, index) => (
                <Grid item xs={4} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      height: '100%'
                    }}
                  >
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: stat.bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: stat.color
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" color={stat.color}>
                            {stat.value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {stat.title}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Filters - Right Half */}
          <Grid item xs={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                p: 1.5,
                height: '100%'
              }}
            >
              <Box display="flex" justifyContent="between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" sx={{ color: '#2c3e50', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterIcon fontSize="small" />
                  Bộ lọc
                  {hasActiveFilters && (
                    <Chip 
                      label={Object.values(filters).filter(v => v !== '').length}
                      size="small"
                      color="primary"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Typography>
                {hasActiveFilters && (
                  <Button
                    startIcon={<ClearIcon />}
                    onClick={clearFilters}
                    size="small"
                    sx={{ color: '#666', fontSize: '0.7rem', minWidth: 'auto', p: 0.5 }}
                  >
                    Xóa
                  </Button>
                )}
              </Box>
              
              <Grid container spacing={1}>
                <Grid item xs={3}>
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
                          <SearchIcon sx={{ color: '#666', fontSize: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    select
                    name="status"
                    label="Trạng thái"
                    value={filters.status}
                    onChange={handleFilterChange}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="1">Đang kiểm kê</MenuItem>
                    <MenuItem value="2">Đã hoàn tất</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={2.5}>
                  <TextField
                    select
                    name="staffId"
                    label="Nhân viên"
                    value={filters.staffId}
                    onChange={handleFilterChange}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {staffs.map((staff) => (
                      <MenuItem key={staff.id || staff.staffId} value={staff.id || staff.staffId}>
                        {staff.fullName || staff.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={2.25}>
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

                <Grid item xs={2.25}>
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
            </Paper>
          </Grid>
        </Grid>

        {/* Table Section - Takes remaining space */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Table Header */}
          <Box sx={{ p: 1.5, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
            <Typography variant="subtitle1" sx={{ color: '#2c3e50', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <InventoryIcon fontSize="small" />
              Danh sách phiếu kiểm kê
              <Chip 
                label={`${inventory.length} phiếu`}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            </Typography>
          </Box>

          {/* Table Content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.85rem', py: 1 }}>
                    Mã phiếu
                  </TableCell>
                  <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.85rem', py: 1 }}>
                    Nhân viên thực hiện
                  </TableCell>
                  <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.85rem', py: 1 }}>
                    Khu vực kiểm kê
                  </TableCell>
                  <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.85rem', py: 1 }}>
                    Ngày tạo
                  </TableCell>
                  <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.85rem', py: 1 }}>
                    Trạng thái
                  </TableCell>
                  <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center', py: 1 }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  renderTableSkeleton()
                ) : paginatedInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <AssignmentIcon sx={{ fontSize: 40, color: '#bdbdbd', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {hasActiveFilters ? 'Không tìm thấy kết quả' : 'Chưa có phiếu kiểm kê nào'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {hasActiveFilters 
                          ? 'Thử thay đổi bộ lọc để tìm kiếm phiếu kiểm kê khác'
                          : 'Hãy tạo phiếu kiểm kê đầu tiên để bắt đầu'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInventory.map((inv, index) => {
                    const statusConfig = getStatusConfig(inv.status);
                    return (
                      <TableRow
                        hover
                        key={inv.inventoryId || inv.id}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#f0f7ff',
                          }
                        }}
                      >
                        <TableCell 
                          sx={{ fontWeight: 600, color: '#1976d2', py: 1 }}
                          onClick={() => handleViewDetails(inv)}
                        >
                          #{inv.inventoryId || inv.id}
                        </TableCell>
                        <TableCell onClick={() => handleViewDetails(inv)} sx={{ py: 1 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {(inv.staffName || getStaffName(inv.createdId)).charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontSize="0.8rem">
                              {inv.staffName || getStaffName(inv.createdId)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell onClick={() => handleViewDetails(inv)} sx={{ py: 1 }}>
                          <Chip
                            label={getAreaName(inv.areaId)}
                            size="small"
                            sx={{
                              bgcolor: '#e8f5e8',
                              color: '#2e7d32',
                              fontWeight: 'bold',
                              height: 20,
                              fontSize: '0.7rem'
                            }}
                          />
                        </TableCell>
                        <TableCell onClick={() => handleViewDetails(inv)} sx={{ py: 1 }}>
                          <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                            {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell onClick={() => handleViewDetails(inv)} sx={{ py: 1 }}>
                          <Chip
                            icon={statusConfig.icon}
                            label={statusConfig.text}
                            size="small"
                            sx={{
                              bgcolor: statusConfig.bgColor,
                              color: statusConfig.textColor,
                              fontWeight: 'bold',
                              border: 'none',
                              height: 20,
                              fontSize: '0.7rem'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1 }}>
                          <Tooltip title="Thêm hành động" arrow>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, inv)}
                              size="small"
                              sx={{
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                width: 28,
                                height: 28,
                                '&:hover': {
                                  bgcolor: '#bbdefb',
                                },
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Box>

          {/* Pagination */}
          {!loading && inventory.length > 0 && (
            <TablePagination
              component="div"
              count={inventory.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
              labelRowsPerPage=""
              sx={{
                borderTop: '1px solid #e0e0e0',
                bgcolor: '#f8f9fa',
                minHeight: 40,
                '& .MuiTablePagination-toolbar': {
                  minHeight: 40,
                  px: 2
                },
                '& .MuiTablePagination-selectLabel': {
                  display: 'none'
                },
                '& .MuiTablePagination-select': {
                  display: 'none'
                }
              }}
            />
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
              minWidth: 180,
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
    </Box>
  );
};

export default InventoryListPage;