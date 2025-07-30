import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Alert
} from '@mui/material';
import {
  QrCodeScanner as QrCodeScannerIcon,
  CameraAlt as CameraIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import BarcodeScanner from '../../../utils/UseImeiCamVcont';

const ImeiScannerComponent = ({
  open,
  onClose,
  onImeiScanned,
  onToggle
}) => {
  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <QrCodeScannerIcon sx={{ color: '#1976d2' }} />
          <Typography variant="h6" fontWeight="600" color="primary">
            Quét mã IMEI
          </Typography>
        </Box>
        
        <Button
          variant={open ? "outlined" : "contained"}
          startIcon={open ? <StopIcon /> : <CameraIcon />}
          onClick={onToggle}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            background: open ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: open ? '#d32f2f' : 'white',
            borderColor: open ? '#d32f2f' : 'transparent',
            '&:hover': {
              background: open ? '#ffebee' : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {open ? 'Dừng quét' : 'Bắt đầu quét'}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>Hướng dẫn:</strong>
          <br />
          • Nhấn "Bắt đầu quét" để mở camera
          <br />
          • Hướng camera vào mã vạch IMEI trên sản phẩm
          <br />
          • Hệ thống sẽ tự động nhận diện và xử lý IMEI
          <br />
          • IMEI hợp lệ sẽ được đánh dấu ✅, IMEI mới sẽ cần xác nhận ⚠️
        </Typography>
      </Alert>

      {/* Scanner Component */}
      <BarcodeScanner
        open={open}
        onClose={onClose}
        onResult={onImeiScanned}
      />
    </Paper>
  );
};

export default ImeiScannerComponent;