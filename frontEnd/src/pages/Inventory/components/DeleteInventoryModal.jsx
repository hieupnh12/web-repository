import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { deleteInventory } from '../../../services/inventoryService';
import { toast } from 'react-toastify';

const DeleteInventoryModal = ({ 
  open, 
  onClose, 
  inventory, 
  onSuccess 
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!inventory) return;

    try {
      setDeleting(true);
      console.log("🗑️ Deleting inventory:", inventory);
      
      await deleteInventory(inventory.inventoryId || inventory.id);
      
      toast.success('🎉 Xóa phiếu kiểm kê thành công!');
      
      if (onSuccess) {
        onSuccess(inventory);
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Error deleting inventory:', error);
      toast.error(`❌ Không thể xóa phiếu kiểm kê: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  if (!inventory) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 1:
        return {
          text: 'Đang kiểm kê',
          color: 'warning',
          bgColor: '#fff3e0',
          textColor: '#e65100'
        };
      case 2:
        return {
          text: 'Đã hoàn tất',
          color: 'success',
          bgColor: '#e8f5e8',
          textColor: '#2e7d32'
        };
      default:
        return {
          text: 'Không xác định',
          color: 'default',
          bgColor: '#f5f5f5',
          textColor: '#666'
        };
    }
  };

  const statusConfig = getStatusConfig(inventory.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box
          sx={{
            p: 1,
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <WarningIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Xác nhận xóa phiếu kiểm kê
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Hành động này không thể hoàn tác
          </Typography>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            border: '1px solid #ffcdd2'
          }}
        >
          <Typography variant="body2" fontWeight="600" gutterBottom>
            ⚠️ Cảnh báo quan trọng
          </Typography>
          <Typography variant="body2">
            Bạn đang chuẩn bị xóa phiếu kiểm kê này. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn và không thể khôi phục.
          </Typography>
        </Alert>

        {/* Inventory Info */}
        <Box
          sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            bgcolor: '#f8f9fa'
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <AssignmentIcon sx={{ color: '#1976d2' }} />
            <Typography variant="h6" fontWeight="600" color="primary">
              Thông tin phiếu kiểm kê
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Mã phiếu:
              </Typography>
              <Typography variant="body2" fontWeight="600">
                #{inventory.inventoryId || inventory.id}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Trạng thái:
              </Typography>
              <Chip
                label={statusConfig.text}
                size="small"
                sx={{
                  bgcolor: statusConfig.bgColor,
                  color: statusConfig.textColor,
                  fontWeight: 'bold'
                }}
              />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Ngày tạo:
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {inventory.createdAt 
                  ? new Date(inventory.createdAt).toLocaleDateString('vi-VN')
                  : 'N/A'
                }
              </Typography>
            </Box>

            {inventory.staffName && (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Nhân viên thực hiện:
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {inventory.staffName}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Warning for completed inventories */}
        {inventory.status === 2 && (
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 2, 
              borderRadius: 2,
              border: '1px solid #fff3e0'
            }}
          >
            <Typography variant="body2">
              <strong>Lưu ý:</strong> Phiếu kiểm kê này đã hoàn tất. Việc xóa có thể ảnh hưởng đến dữ liệu tồn kho đã được cập nhật.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<CancelIcon />}
          disabled={deleting}
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
          Hủy bỏ
        </Button>

        <Button
          onClick={handleDelete}
          variant="contained"
          startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
          disabled={deleting}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)'
            },
            '&:disabled': {
              background: '#e0e0e0',
              color: '#9e9e9e'
            }
          }}
        >
          {deleting ? 'Đang xóa...' : 'Xác nhận xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteInventoryModal;