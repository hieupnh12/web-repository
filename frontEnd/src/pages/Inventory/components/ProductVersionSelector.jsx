import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Fade,
  Divider
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Memory as MemoryIcon,
  CheckCircle as CheckCircleIcon,
  Palette as PaletteIcon,
  Storage as StorageIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ProductVersionSelector = ({
  inventoryDetails,
  productVersions,
  selectedVersionId,
  onVersionSelect
}) => {
  if (!inventoryDetails || inventoryDetails.length === 0) {
    return (
      <Alert 
        severity="warning" 
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          border: '1px solid #fff3e0',
          '& .MuiAlert-icon': {
            fontSize: 28
          }
        }}
      >
        <Typography variant="body1" fontWeight="600" gutterBottom>
          ⚠️ Chưa có sản phẩm trong phiếu kiểm kê
        </Typography>
        <Typography variant="body2">
          Không có sản phẩm nào trong phiếu kiểm kê này. Vui lòng quay lại trang chi tiết để thêm sản phẩm trước khi tiến hành quét IMEI.
        </Typography>
      </Alert>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: 4, 
        overflow: 'hidden',
        mb: 4 
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 3, 
          bgcolor: '#f8f9fa', 
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              bgcolor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PhoneIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="600" color="primary">
              Chọn phiên bản sản phẩm để quét IMEI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chọn một phiên bản sản phẩm cụ thể để bắt đầu quét và kiểm tra IMEI
            </Typography>
          </Box>
        </Box>

        {/* Summary info */}
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip
            icon={<PhoneIcon />}
            label={`${inventoryDetails.length} sản phẩm`}
            color="primary"
            variant="outlined"
          />
          {selectedVersionId && (
            <Chip
              icon={<CheckCircleIcon />}
              label="Đã chọn phiên bản"
              color="success"
              variant="filled"
            />
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {inventoryDetails.map((detail) => {
            const version = productVersions.find(v => v.versionId === detail.productVersionId);
            if (!version) return null;

            const isSelected = selectedVersionId === detail.productVersionId;
            const difference = (detail.quantity || 0) - (detail.systemQuantity || 0);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={detail.productVersionId}>
                <Fade in={true} timeout={300}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isSelected 
                          ? '0 12px 30px rgba(25,118,210,0.2)' 
                          : '0 8px 25px rgba(0,0,0,0.1)',
                        borderColor: isSelected ? '#1976d2' : '#bdbdbd'
                      },
                      bgcolor: isSelected ? '#f0f7ff' : 'white',
                      position: 'relative',
                      overflow: 'visible'
                    }}
                    onClick={() => onVersionSelect(detail.productVersionId)}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: '#1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1
                        }}
                      >
                        <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    )}

                    <CardContent sx={{ p: 3 }}>
                      {/* Product name */}
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <PhoneIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                        <Typography 
                          variant="subtitle1" 
                          fontWeight="700" 
                          color="primary"
                          sx={{ 
                            fontSize: '1rem',
                            lineHeight: 1.2
                          }}
                        >
                          {version.productName}
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Specifications */}
                      <Box mb={2}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <MemoryIcon sx={{ color: '#666', fontSize: 16 }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>RAM:</strong> {version.ramName}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <StorageIcon sx={{ color: '#666', fontSize: 16 }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>ROM:</strong> {version.romName}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PaletteIcon sx={{ color: '#666', fontSize: 16 }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Màu:</strong> {version.colorName}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Quantities */}
                      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                        <Chip
                          label={`Hệ thống: ${detail.systemQuantity || 0}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Chip
                          label={`Thực tế: ${detail.quantity || 0}`}
                          size="small"
                          color={detail.quantity === detail.systemQuantity ? 'success' : 'warning'}
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>

                      {/* Difference indicator */}
                      {difference !== 0 && (
                        <Box mb={2}>
                          <Chip
                            label={`Chênh lệch: ${difference > 0 ? '+' : ''}${difference}`}
                            size="small"
                            color={difference > 0 ? 'success' : 'error'}
                            variant="filled"
                            sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                      )}

                      {/* Note */}
                      {detail.note && (
                        <Box 
                          sx={{ 
                            p: 1.5, 
                            bgcolor: '#f5f5f5', 
                            borderRadius: 2,
                            border: '1px solid #e0e0e0'
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" fontWeight="600">
                            Ghi chú:
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {detail.note}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>

        {/* Selected version confirmation */}
        {selectedVersionId && (
          <Fade in={true} timeout={500}>
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
              <Typography variant="body1" fontWeight="600" gutterBottom>
                ✅ Đã chọn phiên bản sản phẩm
              </Typography>
              <Typography variant="body2">
                Bạn có thể bắt đầu quét IMEI cho phiên bản đã chọn. Sử dụng máy quét bên dưới để tiến hành quét mã vạch IMEI.
              </Typography>
            </Alert>
          </Fade>
        )}

        {/* Instructions */}
        {!selectedVersionId && (
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3, 
              borderRadius: 3,
              border: '1px solid #e3f2fd',
              '& .MuiAlert-icon': {
                fontSize: 24
              }
            }}
          >
            <Typography variant="body1" fontWeight="600" gutterBottom>
              📋 Hướng dẫn chọn sản phẩm
            </Typography>
            <Typography variant="body2">
              Nhấn vào một trong các thẻ sản phẩm ở trên để chọn phiên bản cần quét IMEI. 
              Sau khi chọn, bạn sẽ có thể sử dụng máy quét để kiểm tra IMEI thực tế.
            </Typography>
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default ProductVersionSelector;