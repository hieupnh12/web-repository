import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Stack
} from '@mui/material';

const InventorySummaryModal = ({
  open,
  onClose,
  onUpdateStock,
  onFinishInventory,
  hasDifference,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận kiểm kê</DialogTitle>
      <DialogContent dividers>
        {hasDifference ? (
          <Typography color="error">
            Có sự chênh lệch tồn kho giữa hệ thống và thực tế. Bạn có muốn cập nhật tồn kho không?
          </Typography>
        ) : (
          <Typography>
            Tồn kho khớp với số lượng thực tế. Bạn vẫn muốn hoàn tất kiểm kê?
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} sx={{ px: 2, py: 1 }}>
          {hasDifference && (
            <Button variant="contained" color="warning" onClick={onUpdateStock}>
              Cập nhật tồn kho
            </Button>
          )}
          <Button variant="contained" onClick={onFinishInventory}>
            Hoàn tất kiểm kê
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Quay lại
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default InventorySummaryModal;
