import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  CircularProgress, 
  Box,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import InventoryForm from './components/InventoryForm';
import { useNavigate } from 'react-router-dom';
import { createInventory } from '../../services/inventoryService';
import { takeWarehouseAreaInven } from '../../services/storage';
import { toast } from 'react-toastify';

const InventoryCreatePage = () => {
  const [formData, setFormData] = useState({ areaId: '' });
  const [areaList, setAreaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setFetching(true);
        setError(null);
        
        const areas = await takeWarehouseAreaInven();
        setAreaList(Array.isArray(areas) ? areas : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        toast.error("Lỗi khi tải dữ liệu");
      } finally {
        setFetching(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const inventoryRequest = {
        areaId: formData.areaId || null,
        status: 1,
        inventoryDetails: [],
        inventoryProductDetails: []
      };
      
      const created = await createInventory(inventoryRequest);
      toast.success("Tạo phiếu kiểm kê thành công!");
      
      // Navigate to details page immediately
      const inventoryId = created?.inventoryId || created?.id;
      if (inventoryId) {
        navigate(`/manager/inventory/details/${inventoryId}`);
      } else {
        // Fallback - navigate to list page
        navigate('/manager/inventory');
      }
    } catch (error) {
      console.error('Tạo phiếu kiểm kê thất bại', error);
      toast.error("Không thể tạo phiếu kiểm kê. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Đang tải dữ liệu...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        sx={{ mb: 3 }}
      >
        <Link 
          color="inherit" 
          href="/manager/inventory"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Kiểm kê
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Tạo phiếu mới
        </Typography>
      </Breadcrumbs>

      {/* Header */}
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
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
        <Box display="flex" alignItems="center" gap={2} sx={{ position: 'relative', zIndex: 2 }}>
          <AssignmentIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Tạo phiếu kiểm kê mới
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Khởi tạo phiếu kiểm kê để theo dõi tồn kho hàng hóa
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Form */}
      <InventoryForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        areaList={areaList}
        loading={loading}
      />
    </Container>
  );
};

export default InventoryCreatePage;