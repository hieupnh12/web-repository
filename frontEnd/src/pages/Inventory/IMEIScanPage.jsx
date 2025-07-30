import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Stack,
  Fade,
  LinearProgress
} from '@mui/material';
import {
  QrCodeScanner as QrCodeScannerIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Visibility as VisibilityIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getInventoryDetailsById,
  saveInventoryProductDetails,
  getProductVersionsByInventory,
  getImeisByProductVersion
} from '../../services/inventoryService';
import { toast } from 'react-toastify';
import ProductVersionSelector from './components/ProductVersionSelector';
import ImeiScannerComponent from './components/ImeiScannerComponent';
import ImeiListDisplay from './components/ImeiListDisplay';

const IMEIScanPage = () => {
  const { inventoryId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [productVersions, setProductVersions] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [existingImeis, setExistingImeis] = useState([]);
  const [scannedImeis, setScannedImeis] = useState([]);
  const [newImeis, setNewImeis] = useState([]);
  const [missingImeis, setMissingImeis] = useState([]);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [inventoryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching inventory data for:", inventoryId);
      
      const [details, versions] = await Promise.all([
        getInventoryDetailsById(inventoryId),
        getProductVersionsByInventory(inventoryId)
      ]);
      
      console.log("📋 Inventory details full response:", details);
      console.log("📦 Product versions:", versions);
      console.log("📱 Inventory product details:", details.inventoryProductDetails);
      
      setInventoryDetails(details.inventoryDetails || []);
      setProductVersions(versions || []);
      
      // Lấy IMEI hiện có từ inventoryProductDetails
      const existingImeiList = details.inventoryProductDetails || [];
      console.log("📱 Setting existing IMEIs:", existingImeiList);
      setExistingImeis(existingImeiList);
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      toast.error('❌ Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleVersionSelect = async (versionId) => {
    console.log("🔄 Selected version:", versionId);
    setSelectedVersionId(versionId);
    
    try {
      // Lấy IMEI thực tế từ ProductItem
      const realImeis = await getImeisByProductVersion(versionId);
      console.log("📱 Real IMEIs from ProductItem:", realImeis);
      
      // Cập nhật existingImeis cho version này
      setExistingImeis(prev => {
        // Xóa IMEI cũ của version này và thêm IMEI mới
        const filtered = prev.filter(item => item.productVersionId !== versionId);
        const newImeis = realImeis.map(item => ({
          imei: item.imei,
          productVersionId: item.productVersionId,
          status: item.status
        }));
        return [...filtered, ...newImeis];
      });
      
    } catch (error) {
      console.error("❌ Error fetching IMEIs:", error);
      toast.error("❌ Không thể tải danh sách IMEI");
    }
    
    // Reset states
    setScannedImeis([]);
    setNewImeis([]);
    setMissingImeis([]);
  };

  const handleImeiScanned = (imeiCode) => {
    if (!selectedVersionId) {
      toast.warning('⚠️ Vui lòng chọn phiên bản sản phẩm trước');
      return;
    }

    console.log("📱 Scanned IMEI:", imeiCode);
    
    // Kiểm tra IMEI đã được quét chưa
    if (scannedImeis.includes(imeiCode) || newImeis.some(item => item.imei === imeiCode)) {
      toast.info('ℹ️ IMEI này đã được quét');
      return;
    }

    // Kiểm tra IMEI có trong danh sách hiện có không
    const versionImeis = existingImeis.filter(imei => imei.productVersionId === selectedVersionId);
    const existingImei = versionImeis.find(item => item.imei === imeiCode);
    
    if (existingImei) {
      // IMEI có trong hệ thống - đánh dấu đã quét
      setScannedImeis(prev => [...prev, imeiCode]);
      toast.success('✅ IMEI hợp lệ - Đã đánh dấu');
    } else {
      // IMEI mới - thêm vào danh sách tạm
      const newImeiItem = {
        imei: imeiCode,
        productVersionId: selectedVersionId,
        status: 'NEW',
        isNew: true
      };
      setNewImeis(prev => [...prev, newImeiItem]);
      toast.warning('⚠️ IMEI mới - Cần xác nhận thêm');
    }
  };

  const handleAddNewImei = (imeiItem) => {
    // Thêm IMEI mới vào danh sách chính thức
    setScannedImeis(prev => [...prev, imeiItem.imei]);
    setNewImeis(prev => prev.filter(item => item.imei !== imeiItem.imei));
    toast.success('✅ Đã thêm IMEI mới');
  };

  const handleRemoveNewImei = (imeiCode) => {
    setNewImeis(prev => prev.filter(item => item.imei !== imeiCode));
    toast.info('🗑️ Đã xóa IMEI tạm');
  };

  const calculateMissingImeis = () => {
    if (!selectedVersionId) return;
    
    const selectedDetail = inventoryDetails.find(detail => detail.productVersionId === selectedVersionId);
    if (!selectedDetail) return;
    
    const systemQuantity = selectedDetail.systemQuantity || 0;
    const versionImeis = existingImeis.filter(imei => imei.productVersionId === selectedVersionId);
    const totalScanned = scannedImeis.length + newImeis.length;
    
    if (totalScanned < systemQuantity) {
      // Có IMEI thiếu
      const missingCount = systemQuantity - totalScanned;
      const missing = versionImeis
        .filter(item => !scannedImeis.includes(item.imei))
        .slice(0, missingCount)
        .map(item => item.imei);
      
      setMissingImeis(missing);
    } else {
      setMissingImeis([]);
    }
  };

  useEffect(() => {
    calculateMissingImeis();
  }, [selectedVersionId, scannedImeis, newImeis, inventoryDetails, existingImeis]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Tạo danh sách IMEI để lưu - chỉ gửi IMEI mới và thiếu
      const imeiList = [
        // IMEI mới được quét
        ...newImeis.map(item => ({
          imei: item.imei,
          productVersionId: item.productVersionId,
          status: 'NEW'
        })),
        // IMEI thiếu (nếu có)
        ...missingImeis.map(imei => ({
          imei,
          productVersionId: selectedVersionId,
          status: 'MISSING'
        }))
      ];
      
      console.log("💾 Saving IMEI list:", imeiList);
      console.log("📊 Scanned existing IMEIs (not saved):", scannedImeis);
      
      // Chỉ lưu nếu có IMEI mới hoặc thiếu
      if (imeiList.length > 0) {
        await saveInventoryProductDetails(inventoryId, imeiList);
        toast.success(`🎉 Lưu thành công ${imeiList.length} IMEI!`);
      } else {
        toast.info('ℹ️ Không có IMEI mới hoặc thiếu để lưu');
      }
      
      navigate(`/manager/inventory/summary/${inventoryId}`);
      
    } catch (error) {
      console.error('❌ Error saving IMEI:', error);
      toast.error('❌ Không thể lưu danh sách IMEI');
    } finally {
      setSaving(false);
    }
  };

  const getSelectedVersionInfo = () => {
    if (!selectedVersionId) return null;
    const version = productVersions.find(v => v.versionId === selectedVersionId);
    const detail = inventoryDetails.find(d => d.productVersionId === selectedVersionId);
    return { version, detail };
  };

  const selectedInfo = getSelectedVersionInfo();
  const versionImeis = selectedVersionId ? existingImeis.filter(imei => imei.productVersionId === selectedVersionId) : [];
  const systemQuantity = selectedInfo?.detail?.systemQuantity || 0;
  const totalScanned = scannedImeis.length + newImeis.length;
  const scanProgress = systemQuantity > 0 ? (totalScanned / systemQuantity) * 100 : 0;

  // Statistics
  const stats = {
    systemImeis: versionImeis.length,
    scannedImeis: scannedImeis.length,
    newImeis: newImeis.length,
    missingImeis: missingImeis.length
  };

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
            <QrCodeScannerIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Quét IMEI - Phiếu #{inventoryId}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Quét và kiểm tra IMEI thực tế của các sản phẩm trong kho
            </Typography>
          </Box>
          
          {/* Progress indicator */}
          {selectedVersionId && (
            <Box sx={{ minWidth: 120, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                {Math.round(scanProgress)}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Tiến độ quét
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={scanProgress} 
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
              <Typography variant="caption" sx={{ opacity: 0.7, mt: 0.5, display: 'block' }}>
                {totalScanned}/{systemQuantity} IMEI
              </Typography>
            </Box>
          )}
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
                <VisibilityIcon sx={{ fontSize: 24, color: '#1976d2' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {stats.systemImeis}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IMEI hệ thống
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
                <CheckCircleIcon sx={{ fontSize: 24, color: '#4caf50' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {stats.scannedImeis}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã quét
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
                <WarningIcon sx={{ fontSize: 24, color: '#ff9800' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {stats.newImeis}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IMEI mới
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
                  bgcolor: stats.missingImeis > 0 ? '#ffebee' : '#e8f5e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1
                }}
              >
                <ErrorIcon sx={{ fontSize: 24, color: stats.missingImeis > 0 ? '#f44336' : '#4caf50' }} />
              </Box>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color={stats.missingImeis > 0 ? 'error.main' : 'success.main'}
              >
                {stats.missingImeis}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IMEI thiếu
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Product Version Selector */}
      <ProductVersionSelector
        inventoryDetails={inventoryDetails}
        productVersions={productVersions}
        selectedVersionId={selectedVersionId}
        onVersionSelect={handleVersionSelect}
      />

      {/* Scanner and Results */}
      {selectedVersionId && (
        <Fade in={true} timeout={500}>
          <Box>
            {/* Version Info */}
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                border: '1px solid #e3f2fd'
              }}
            >
              <Typography variant="body2" fontWeight="600" gutterBottom>
                📱 Thông tin sản phẩm đang quét
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="body2">
                    <strong>Sản phẩm:</strong> {selectedInfo?.version?.productName}
                    <br />
                    <strong>Cấu hình:</strong> {selectedInfo?.version?.ramName} | {selectedInfo?.version?.romName} | {selectedInfo?.version?.colorName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">
                    <strong>Hệ thống:</strong> {systemQuantity} | <strong>Đã quét:</strong> {totalScanned} | <strong>Còn lại:</strong> {Math.max(0, systemQuantity - totalScanned)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={scanProgress} 
                    sx={{ 
                      mt: 1, 
                      height: 4, 
                      borderRadius: 2,
                      bgcolor: '#e0e0e0'
                    }} 
                  />
                </Grid>
              </Grid>
            </Alert>

            {/* Scanner Component */}
            <ImeiScannerComponent
              open={scannerOpen}
              onClose={() => setScannerOpen(false)}
              onImeiScanned={handleImeiScanned}
              onToggle={() => setScannerOpen(!scannerOpen)}
            />

            {/* IMEI Lists */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Existing IMEIs */}
              <Grid item xs={12} md={4}>
                <ImeiListDisplay
                  title="IMEI Hệ thống"
                  imeis={versionImeis.map(item => item.imei)}
                  scannedImeis={scannedImeis}
                  type="system"
                />
              </Grid>

              {/* New IMEIs */}
              <Grid item xs={12} md={4}>
                <ImeiListDisplay
                  title="IMEI Mới quét"
                  imeis={newImeis}
                  onAdd={handleAddNewImei}
                  onRemove={handleRemoveNewImei}
                  type="new"
                />
              </Grid>

              {/* Missing IMEIs */}
              <Grid item xs={12} md={4}>
                <ImeiListDisplay
                  title="IMEI Thiếu"
                  imeis={missingImeis}
                  type="missing"
                />
              </Grid>
            </Grid>

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
                  onClick={() => navigate(`/manager/inventory/details/${inventoryId}`)}
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
                  Quay lại chi tiết phiếu
                </Button>

                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
                  onClick={handleSave}
                  disabled={saving}
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
                  {saving ? 'Đang lưu...' : 'Hoàn tất quét IMEI'}
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default IMEIScanPage;