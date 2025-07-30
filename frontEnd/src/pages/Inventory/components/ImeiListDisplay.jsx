import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Chip,
  Alert,
  Fade
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const ImeiListDisplay = ({
  title,
  imeis,
  scannedImeis = [],
  onAdd,
  onRemove,
  type = 'system'
}) => {
  const getIconAndColor = (imei, isScanned) => {
    switch (type) {
      case 'system':
        return {
          icon: isScanned ? <CheckCircleIcon /> : <UncheckedIcon />,
          color: isScanned ? '#4caf50' : '#bdbdbd',
          bgColor: isScanned ? '#e8f5e8' : '#f5f5f5'
        };
      case 'new':
        return {
          icon: <WarningIcon />,
          color: '#ff9800',
          bgColor: '#fff3e0'
        };
      case 'missing':
        return {
          icon: <ErrorIcon />,
          color: '#f44336',
          bgColor: '#ffebee'
        };
      default:
        return {
          icon: <PhoneIcon />,
          color: '#1976d2',
          bgColor: '#e3f2fd'
        };
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case 'system':
        return '#1976d2';
      case 'new':
        return '#ff9800';
      case 'missing':
        return '#f44336';
      default:
        return '#1976d2';
    }
  };

  const getEmptyMessage = () => {
    switch (type) {
      case 'system':
        return 'Chưa có IMEI nào trong hệ thống';
      case 'new':
        return 'Chưa quét được IMEI mới nào';
      case 'missing':
        return 'Không có IMEI nào bị thiếu';
      default:
        return 'Danh sách trống';
    }
  };

  const renderSystemImei = (imei, index) => {
    const isScanned = scannedImeis.includes(imei);
    const { icon, color, bgColor } = getIconAndColor(imei, isScanned);
    
    return (
      <Fade in={true} timeout={300 + index * 100} key={imei}>
        <ListItem
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            mb: 1,
            bgcolor: bgColor,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ color }}>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight={isScanned ? 600 : 400}>
                {imei}
              </Typography>
            }
            secondary={isScanned ? "Đã quét" : "Chưa quét"}
          />
          {isScanned && (
            <Chip
              label="✓"
              size="small"
              sx={{
                bgcolor: '#4caf50',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
        </ListItem>
      </Fade>
    );
  };

  const renderNewImei = (imeiItem, index) => {
    const { icon, color, bgColor } = getIconAndColor();
    
    return (
      <Fade in={true} timeout={300 + index * 100} key={imeiItem.imei}>
        <ListItem
          sx={{
            border: '1px solid #ff9800',
            borderRadius: 2,
            mb: 1,
            bgcolor: bgColor,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ color }}>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight={600}>
                {imeiItem.imei}
              </Typography>
            }
            secondary="IMEI mới - Cần xác nhận"
          />
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => onAdd && onAdd(imeiItem)}
              sx={{
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#45a049' },
                borderRadius: 1
              }}
            >
              Thêm
            </Button>
            <IconButton
              size="small"
              onClick={() => onRemove && onRemove(imeiItem.imei)}
              sx={{
                color: '#f44336',
                '&:hover': { bgcolor: '#ffebee' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
      </Fade>
    );
  };

  const renderMissingImei = (imei, index) => {
    const { icon, color, bgColor } = getIconAndColor();
    
    return (
      <Fade in={true} timeout={300 + index * 100} key={imei}>
        <ListItem
          sx={{
            border: '1px solid #f44336',
            borderRadius: 2,
            mb: 1,
            bgcolor: bgColor,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <ListItemIcon sx={{ color }}>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight={600}>
                {imei}
              </Typography>
            }
            secondary="Không tìm thấy trong kho thực tế"
          />
          <Chip
            label="Thiếu"
            size="small"
            sx={{
              bgcolor: '#f44336',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </ListItem>
      </Fade>
    );
  };

  const renderImeiItem = (item, index) => {
    switch (type) {
      case 'system':
        return renderSystemImei(item, index);
      case 'new':
        return renderNewImei(item, index);
      case 'missing':
        return renderMissingImei(item, index);
      default:
        return null;
    }
  };

  const getStats = () => {
    switch (type) {
      case 'system':
        const scannedCount = scannedImeis.length;
        const totalCount = imeis.length;
        return `${scannedCount}/${totalCount}`;
      case 'new':
        return imeis.length;
      case 'missing':
        return imeis.length;
      default:
        return imeis.length;
    }
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, height: 'fit-content' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: getHeaderColor(),
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight="600">
            {title}
          </Typography>
          <Chip
            label={getStats()}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
        {imeis.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              {getEmptyMessage()}
            </Typography>
          </Alert>
        ) : (
          <List sx={{ p: 0 }}>
            {imeis.map((item, index) => renderImeiItem(item, index))}
          </List>
        )}
      </Box>

      {/* Footer */}
      {type === 'missing' && imeis.length > 0 && (
        <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: '0 0 12px 12px' }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Cảnh báo:</strong> Có {imeis.length} IMEI không tìm thấy trong kho thực tế.
              Cần kiểm tra lại hoặc báo cáo mất hàng.
            </Typography>
          </Alert>
        </Box>
      )}
    </Paper>
  );
};

export default ImeiListDisplay;