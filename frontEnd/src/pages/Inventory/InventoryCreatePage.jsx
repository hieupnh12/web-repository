import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  CircularProgress, 
  Box,
  Alert,
  Breadcrumbs,
  Link,
  Button
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Warehouse as WarehouseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createInventory } from '../../services/inventoryService';
import { toast } from 'react-toastify';

const InventoryCreatePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateInventory = async () => {
    setLoading(true);
    try {
      const inventoryRequest = {
        areaId: null, // Luôn kiểm kê toàn kho
        status: 1,
        inventoryDetails: [],
        inventoryProductDetails: []
      };
      
      console.log("🔄 Creating inventory:", inventoryRequest);
      const created = await createInventory(inventoryRequest);
      console.log("✅ Created inventory:", created);
      
      toast.success("Tạo phiếu kiểm kê thành công!");
      
      // Navigate to details page immediately
      const inventoryId = created?.inventoryId || created?.id;
      if (inventoryId) {
        navigate(`/manager/inventory/details/${inventoryId}`);
      } else {
        console.error("❌ No inventory ID returned:", created);
        toast.error("Lỗi: Không nhận được ID phiếu kiểm kê");
        navigate('/manager/inventory');
      }
    } catch (error) {
      console.error('❌ Tạo phiếu kiểm kê thất bại:', error);
      toast.error("Không thể tạo phiếu kiểm kê. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

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
              Khởi tạo phiếu kiểm kê toàn bộ kho hàng
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 4 }}>
        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <WarehouseIcon sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="body1" fontWeight="600">
                Phiếu kiểm kê toàn bộ kho hàng
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Hệ thống sẽ tạo phiếu kiểm kê cho tất cả sản phẩm trong kho và chuyển bạn đến trang nhập chi tiết.
              </Typography>
            </Box>
          </Box>
        </Alert>

        {/* Action Section */}
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" gutterBottom color="primary" fontWeight="600">
            Sẵn sàng tạo phiếu kiểm kê?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Click vào nút bên dưới để tạo phiếu kiểm kê và bắt đầu nhập chi tiết sản phẩm
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleCreateInventory}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            sx={{
              borderRadius: 3,
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
              },
              '&:disabled': {
                background: '#ccc'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Đang tạo phiếu...' : 'Tạo phiếu kiểm kê ngay'}
          </Button>
        </Box>

        {/* Process Info */}
        <Alert severity="success" sx={{ mt: 4, borderRadius: 2 }}>
          <Typography variant="body2">
            <strong>Quy trình:</strong> Sau khi tạo phiếu thành công, bạn sẽ được chuyển đến trang chi tiết để:
            <br />
            • Thêm các sản phẩm cần kiểm kê
            • Nhập số lượng hệ thống và thực tế
            • Quét IMEI (tùy chọn) hoặc hoàn tất kiểm kê
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default InventoryCreatePage;