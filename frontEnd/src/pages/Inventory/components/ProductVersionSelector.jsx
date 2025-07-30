import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Alert
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Memory as MemoryIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const ProductVersionSelector = ({
  inventoryDetails,
  productVersions,
  selectedVersionId,
  onVersionSelect
}) => {
  if (!inventoryDetails || inventoryDetails.length === 0) {
    return (
      <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          Không có sản phẩm nào trong phiếu kiểm kê này. Vui lòng quay lại trang chi tiết để thêm sản phẩm.
        </Typography>
      </Alert>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 3, mb: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <PhoneIcon sx={{ color: '#1976d2' }} />
        <Typography variant="h6" fontWeight="600" color="primary">
          Chọn phiên bản sản phẩm để quét IMEI
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {inventoryDetails.map((detail) => {
          const version = productVersions.find(v => v.versionId === detail.productVersionId);
          if (!version) return null;

          const isSelected = selectedVersionId === detail.productVersionId;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={detail.productVersionId}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    borderColor: isSelected ? '#1976d2' : '#bdbdbd'
                  },
                  bgcolor: isSelected ? '#f0f7ff' : 'white'
                }}
                onClick={() => onVersionSelect(detail.productVersionId)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <PhoneIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight="600" color="primary">
                      {version.productName}
                    </Typography>
                    {isSelected && (
                      <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20, ml: 'auto' }} />
                    )}
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <MemoryIcon sx={{ color: '#666', fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      {version.ramName} | {version.romName} | {version.colorName}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={`SL hệ thống: ${detail.systemQuantity || 0}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`SL thực tế: ${detail.quantity || 0}`}
                      size="small"
                      color={detail.quantity === detail.systemQuantity ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Box>

                  {detail.note && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Ghi chú: {detail.note}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {selectedVersionId && (
        <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
          <Typography variant="body2">
            ✅ Đã chọn phiên bản sản phẩm. Bạn có thể bắt đầu quét IMEI bên dưới.
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default ProductVersionSelector;