import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import {
  QrCodeScanner as QrCodeScannerIcon,
  CameraAlt as CameraIcon,
  Stop as StopIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import BarcodeScanner from '../../../utils/UseImeiCamVcont';

const ImeiScannerComponent = ({
  open,
  onClose,
  onImeiScanned,
  onToggle
}) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: 4, 
        overflow: 'hidden',
        mb: 3 
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 3, 
          bgcolor: open ? '#e8f5e8' : '#f8f9fa', 
          borderBottom: '1px solid #e0e0e0',
          transition: 'background-color 0.3s ease'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                bgcolor: open ? '#4caf50' : '#1976d2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <QrCodeScannerIcon sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="600" color="primary">
                Máy quét mã IMEI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {open ? 'Đang hoạt động - Sẵn sàng quét' : 'Nhấn để bắt đầu quét IMEI'}
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant={open ? "outlined" : "contained"}
            startIcon={open ? <StopIcon /> : <CameraIcon />}
            onClick={onToggle}
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              background: open ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: open ? '#d32f2f' : 'white',
              borderColor: open ? '#d32f2f' : 'transparent',
              '&:hover': {
                background: open ? '#ffebee' : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-2px)',
                boxShadow: open ? '0 4px 12px rgba(211,47,47,0.2)' : '0 8px 25px rgba(102,126,234,0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {open ? 'Dừng quét' : 'Bắt đầu quét'}
          </Button>
        </Box>

        {/* Status indicator */}
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            icon={open ? <CheckCircleIcon /> : <VisibilityIcon />}
            label={open ? 'Camera đang hoạt động' : 'Camera chưa khởi động'}
            color={open ? 'success' : 'default'}
            variant={open ? 'filled' : 'outlined'}
            sx={{
              fontWeight: 600,
              '& .MuiChip-icon': {
                fontSize: 18
              }
            }}
          />
          {open && (
            <Typography variant="caption" color="success.main" fontWeight="600">
              ● Sẵn sàng nhận diện mã vạch
            </Typography>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Instructions */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ bgcolor: '#f0f7ff', border: '1px solid #e3f2fd' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <InfoIcon sx={{ color: '#1976d2' }} />
                  <Typography variant="h6" fontWeight="600" color="primary">
                    Hướng dẫn sử dụng
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>Bước 1:</strong> Nhấn "Bắt đầu quét" để mở camera
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>Bước 2:</strong> Hướng camera vào mã vạch IMEI trên sản phẩm
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>Bước 3:</strong> Giữ camera ổn định cho đến khi nhận diện thành công
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Bước 4:</strong> Hệ thống sẽ tự động xử lý và phân loại IMEI
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Status indicators */}
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  📊 Trạng thái quét
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>IMEI hợp lệ:</strong> Được đánh dấu ✅
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <WarningIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>IMEI mới:</strong> Cần xác nhận thêm ⚠️
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <InfoIcon sx={{ color: '#2196f3', fontSize: 20 }} />
                    <Typography variant="body2">
                      <strong>IMEI trùng:</strong> Thông báo đã quét
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Scanner Component */}
        <Box sx={{ mt: 3 }}>
          <BarcodeScanner
            open={open}
            onClose={onClose}
            onResult={onImeiScanned}
          />
        </Box>

        {/* Tips */}
        {open && (
          <Alert 
            severity="success" 
            sx={{ 
              mt: 3, 
              borderRadius: 3,
              border: '1px solid #c8e6c9',
              '& .MuiAlert-icon': {
                fontSize: 24
              }
            }}
          >
            <Typography variant="body2" fontWeight="600" gutterBottom>
              💡 Mẹo để quét hiệu quả:
            </Typography>
            <Typography variant="body2" component="div">
              • Đảm bảo ánh sáng đủ sáng và mã vạch rõ nét
              <br />
              • Giữ camera cách mã vạch khoảng 10-15cm
              <br />
              • Tránh rung lắc, giữ camera ổn định
              <br />
              • Nếu không nhận diện được, thử thay đổi góc độ
            </Typography>
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default ImeiScannerComponent;