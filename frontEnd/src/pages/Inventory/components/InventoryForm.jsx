import React from 'react';
import { 
  TextField, 
  MenuItem, 
  Button, 
  Grid, 
  Box, 
  Typography, 
  Card, 
  CardContent,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const InventoryForm = ({ formData, onChange, onSubmit, areaList, loading }) => {
  return (
    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <InfoIcon />
            <Typography variant="body2">
              Chọn khu vực cần kiểm kê. Để trống nếu muốn kiểm kê toàn bộ kho hàng.
            </Typography>
          </Box>
        </Alert>

        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="600" mb={2} color="primary">
                Thông tin phiếu kiểm kê
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Khu vực kiểm kê"
                name="areaId"
                value={formData.areaId}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: '#e8f5e8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        color: '#2e7d32'
                      }}
                    >
                      ∀
                    </Box>
                    Toàn bộ kho hàng
                  </Box>
                </MenuItem>
                {Array.isArray(areaList) && areaList.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: '#fff3e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          color: '#e65100'
                        }}
                      >
                        {area.name.charAt(0).toUpperCase()}
                      </Box>
                      {area.name}
                      {area.note && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({area.note})
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Lưu ý:</strong> Sau khi tạo phiếu kiểm kê, bạn sẽ được chuyển đến trang nhập chi tiết sản phẩm cần kiểm kê.
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                    },
                    '&:disabled': {
                      background: '#ccc'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Đang tạo phiếu...' : 'Tạo phiếu kiểm kê'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default InventoryForm;