import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress, 
  Stack,
  Box,
  Breadcrumbs,
  Link,
  Alert
} from '@mui/material';
import { 
  useParams, 
  useNavigate 
} from 'react-router-dom';
import {
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  QrCodeScanner as QrCodeScannerIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import InventoryDetailsTable from './components/InventoryDetailsTable';
import { getProductVersions, saveInventoryDetails } from '../../services/inventoryService';
import { toast } from 'react-toastify';

function InventoryDetailsPage() {
  const { inventoryId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [productVersions, setProductVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        const versions = await getProductVersions();
        setProductVersions(versions || []);
      } catch (error) {
        console.error('Error fetching product versions:', error);
        toast.error('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, []);

  const handleAddRow = () => {
    setRows((prev) => [...prev, { 
      productVersionId: '', 
      selectedProduct: '', // Thêm field để lưu sản phẩm đã chọn
      systemQuantity: 0, 
      quantity: 0, 
      note: '' 
    }]);
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeRow = (index, e) => {
    const { name, value } = e.target;
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { 
          ...row, 
          [name]: name === 'systemQuantity' || name === 'quantity' ? Number(value) : value 
        } : row
      )
    );
  };

  const handleSubmit = async () => {
    if (rows.length === 0) {
      toast.warning('Vui lòng thêm ít nhất một sản phẩm');
      return;
    }


    const invalidRows = rows.filter(row => !row.productVersionId);
    if (invalidRows.length > 0) {
      toast.error('Vui lòng nhập các thông tin cần thiết');
      return;
    }

    try {
      setSaving(true);
      await saveInventoryDetails(inventoryId, rows);
      toast.success('Lưu chi tiết kiểm kê thành công!');
      navigate(`/manager/inventory/scan/${inventoryId}`);
    } catch (err) {
      console.error('Lỗi khi lưu chi tiết kiểm kê', err);
      toast.error('Không thể lưu chi tiết kiểm kê');
    } finally {
      setSaving(false);
    }
  };

  const handleFinishWithoutScan = async () => {
    if (rows.length === 0) {
      toast.warning('Vui lòng thêm ít nhất một sản phẩm');
      return;
    }

    try {
      setSaving(true);
      await saveInventoryDetails(inventoryId, rows);
      toast.success('Hoàn tất kiểm kê thành công!');
      navigate(`/manager/inventory/summary/${inventoryId}`);
    } catch (err) {
      console.error('Lỗi hoàn tất kiểm kê', err);
      toast.error('Không thể hoàn tất kiểm kê');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          Chi tiết phiếu #{inventoryId}
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
              Chi tiết kiểm kê - Phiếu #{inventoryId}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Nhập thông tin chi tiết các sản phẩm cần kiểm kê toàn bộ kho hàng
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Warehouse Info */}
      <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>Phạm vi kiểm kê:</strong> Toàn bộ kho hàng
          <br />
          <strong>Số lượng sản phẩm khả dụng:</strong> {productVersions.length} sản phẩm
        </Typography>
      </Alert>

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>Hướng dẫn:</strong> Thêm các sản phẩm cần kiểm kê, nhập số lượng hệ thống và số lượng thực tế. 
          Sau đó bạn có thể tiếp tục quét IMEI hoặc hoàn tất kiểm kê.
        </Typography>
      </Alert>

      {/* Table */}
      <Box sx={{ mb: 4 }}>
        <InventoryDetailsTable
          rows={rows}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          onChangeRow={handleChangeRow}
          productVersions={productVersions}
        />
      </Box>

      {/* Action Buttons */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/manager/inventory')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              borderColor: '#e0e0e0',
              color: '#666',
              '&:hover': {
                borderColor: '#bdbdbd',
                bgcolor: '#f5f5f5'
              }
            }}
          >
            Quay lại danh sách
          </Button>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              color="warning"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
              onClick={handleFinishWithoutScan}
              disabled={saving || rows.length === 0}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Hoàn tất không quét IMEI
            </Button>

            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <QrCodeScannerIcon />}
              onClick={handleSubmit}
              disabled={saving || rows.length === 0}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Tiếp tục quét IMEI
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default InventoryDetailsPage;