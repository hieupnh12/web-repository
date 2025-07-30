import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress, 
  Stack,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  useParams, 
  useNavigate 
} from 'react-router-dom';
import {
  Assignment as AssignmentIcon,
  QrCodeScanner as QrCodeScannerIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Speed as SpeedIcon
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
      selectedProduct: '', 
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
      toast.success('🎉 Lưu chi tiết kiểm kê thành công!');
      navigate(`/manager/inventory/scan/${inventoryId}`);
    } catch (err) {
      console.error('Lỗi khi lưu chi tiết kiểm kê', err);
      toast.error('❌ Không thể lưu chi tiết kiểm kê');
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
      toast.success('🎉 Hoàn tất kiểm kê thành công!');
      navigate(`/manager/inventory/summary/${inventoryId}`);
    } catch (err) {
      console.error('Lỗi hoàn tất kiểm kê', err);
      toast.error('❌ Không thể hoàn tất kiểm kê');
    } finally {
      setSaving(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalProducts: rows.length,
    totalSystemQuantity: rows.reduce((sum, row) => sum + (row.systemQuantity || 0), 0),
    totalActualQuantity: rows.reduce((sum, row) => sum + (row.quantity || 0), 0),
    differences: rows.filter(row => (row.quantity || 0) !== (row.systemQuantity || 0)).length
  };

  const completionPercentage = rows.length > 0 ? (rows.filter(row => row.productVersionId).length / rows.length) * 100 : 0;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <CircularProgress size={48} sx={{ color: '#667eea' }} />
            <Typography variant="h6" sx={{ mt: 2, color: '#667eea' }}>
              Đang tải dữ liệu...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Vui lòng chờ trong giây lát
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 3,
          mb: 3,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
        
        <Box display="flex" alignItems="center" gap={2} sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AssignmentIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Chi tiết kiểm kê - Phiếu #{inventoryId}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Nhập thông tin chi tiết các sản phẩm cần kiểm kê
            </Typography>
          </Box>
          
          {/* Progress indicator */}
          <Box sx={{ minWidth: 120, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {Math.round(completionPercentage)}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Hoàn thành
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={completionPercentage} 
              sx={{ 
                mt: 1, 
                height: 6, 
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white'
                }
              }} 
            />
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1
                }}
              >
                <InventoryIcon sx={{ fontSize: 24, color: '#1976d2' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {stats.totalProducts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sản phẩm
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#e8f5e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 24, color: '#4caf50' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {stats.totalSystemQuantity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SL hệ thống
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#fff3e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1
                }}
              >
                <SpeedIcon sx={{ fontSize: 24, color: '#ff9800' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {stats.totalActualQuantity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SL thực tế
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: stats.differences > 0 ? '#ffebee' : '#e8f5e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1
                }}
              >
                <WarningIcon sx={{ fontSize: 24, color: stats.differences > 0 ? '#f44336' : '#4caf50' }} />
              </Box>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color={stats.differences > 0 ? 'error.main' : 'success.main'}
              >
                {stats.differences}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chênh lệch
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Information Alert */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          border: '1px solid #e3f2fd'
        }}
      >
        <Typography variant="body2" fontWeight="600" gutterBottom>
          📋 Hướng dẫn thực hiện kiểm kê
        </Typography>
        <Typography variant="body2">
          <strong>1.</strong> Thêm sản phẩm → <strong>2.</strong> Chọn phiên bản → <strong>3.</strong> Nhập số lượng → <strong>4.</strong> Tiếp tục quét IMEI hoặc hoàn tất
        </Typography>
      </Alert>

      {/* Table */}
      <Box sx={{ mb: 3 }}>
        <InventoryDetailsTable
          rows={rows}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          onChangeRow={handleChangeRow}
          productVersions={productVersions}
        />
      </Box>

      {/* Action Buttons */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          border: '1px solid #e0e0e0', 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
        }}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="space-between" 
          alignItems="center"
        >
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
                  background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)'
                },
                '&:disabled': {
                  background: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              {saving ? 'Đang xử lý...' : 'Hoàn tất không quét IMEI'}
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
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                },
                '&:disabled': {
                  background: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              {saving ? 'Đang lưu...' : 'Tiếp tục quét IMEI'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default InventoryDetailsPage;