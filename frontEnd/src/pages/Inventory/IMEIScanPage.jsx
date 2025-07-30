import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  Breadcrumbs,
  Link,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Fade
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  QrCodeScanner as QrCodeScannerIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon
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
      toast.error('Không thể tải dữ liệu');
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
      toast.error("Không thể tải danh sách IMEI");
    }
    
    // Reset states
    setScannedImeis([]);
    setNewImeis([]);
    setMissingImeis([]);
  };

  const handleImeiScanned = (imeiCode) => {
    if (!selectedVersionId) {
      toast.warning('Vui lòng chọn phiên bản sản phẩm trước');
      return;
    }

    console.log("📱 Scanned IMEI:", imeiCode);
    
    // Kiểm tra IMEI đã được quét chưa
    if (scannedImeis.includes(imeiCode) || newImeis.some(item => item.imei === imeiCode)) {
      toast.info('IMEI này đã được quét');
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
      
      // Tạo danh sách IMEI để lưu
      const imeiList = [
        // IMEI đã quét (có trong hệ thống)
        ...scannedImeis.map(imei => ({
          imei,
          productVersionId: selectedVersionId,
          status: 'FOUND'
        })),
        // IMEI mới
        ...newImeis.map(item => ({
          imei: item.imei,
          productVersionId: item.productVersionId,
          status: 'NEW'
        }))
      ];
      
      console.log("💾 Saving IMEI list:", imeiList);
      
      await saveInventoryProductDetails(inventoryId, imeiList);
      toast.success('Lưu danh sách IMEI thành công!');
      navigate(`/manager/inventory/summary/${inventoryId}`);
      
    } catch (error) {
      console.error('❌ Error saving IMEI:', error);
      toast.error('Không thể lưu danh sách IMEI');
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
        <Link 
          color="inherit" 
          href={`/manager/inventory/details/${inventoryId}`}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <AssignmentIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Chi tiết phiếu #{inventoryId}
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <QrCodeScannerIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Quét IMEI
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
          <QrCodeScannerIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Quét IMEI - Phiếu #{inventoryId}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Quét và kiểm tra IMEI thực tế của các sản phẩm
            </Typography>
          </Box>
        </Box>
      </Paper>

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
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Đang quét cho:</strong> {selectedInfo?.version?.productName}
                <br />
                <strong>Cấu hình:</strong> {selectedInfo?.version?.ramName} | {selectedInfo?.version?.romName} | {selectedInfo?.version?.colorName}
                <br />
                <strong>Số lượng hệ thống:</strong> {systemQuantity} | 
                <strong> Đã quét:</strong> {totalScanned} | 
                <strong> Còn lại:</strong> {Math.max(0, systemQuantity - totalScanned)}
              </Typography>
            </Alert>

            {/* Scanner Component */}
            <ImeiScannerComponent
              open={scannerOpen}
              onClose={() => setScannerOpen(false)}
              onImeiScanned={handleImeiScanned}
              onToggle={() => setScannerOpen(!scannerOpen)}
            />

            {/* IMEI Lists */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
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
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3, mt: 4 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
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

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
                    onClick={handleSave}
                    disabled={saving || (scannedImeis.length === 0 && newImeis.length === 0)}
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
                    {saving ? 'Đang lưu...' : 'Hoàn tất quét IMEI'}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default IMEIScanPage;