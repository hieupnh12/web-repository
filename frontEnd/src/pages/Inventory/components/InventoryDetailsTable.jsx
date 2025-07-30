import React from 'react';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton, 
  TextField, 
  MenuItem, 
  Paper, 
  Button,
  Box,
  Typography,
  Chip,
  Fade
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Add as AddIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';

const InventoryDetailsTable = ({
  rows,
  onAddRow,
  onRemoveRow,
  onChangeRow,
  productVersions,
}) => {
  const getDifference = (actual, system) => {
    const diff = actual - system;
    return {
      value: diff,
      color: diff > 0 ? 'success' : diff < 0 ? 'error' : 'default',
      text: diff > 0 ? `+${diff}` : diff.toString()
    };
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <InventoryIcon sx={{ color: '#1976d2' }} />
            <Typography variant="h6" fontWeight="600" color="primary">
              Chi tiết sản phẩm kiểm kê
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddRow}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Thêm sản phẩm
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, minWidth: 250 }}>
                Phiên bản sản phẩm
              </TableCell>
              <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, width: 150 }}>
                SL hệ thống
              </TableCell>
              <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, width: 150 }}>
                SL thực tế
              </TableCell>
              <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, width: 120 }}>
                Chênh lệch
              </TableCell>
              <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, minWidth: 200 }}>
                Ghi chú
              </TableCell>
              <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, width: 80, textAlign: 'center' }}>
                Xóa
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <InventoryIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Chưa có sản phẩm nào
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nhấn "Thêm sản phẩm" để bắt đầu
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                const diff = getDifference(row.quantity || 0, row.systemQuantity || 0);
                return (
                  <Fade in={true} timeout={300 + index * 100} key={index}>
                    <TableRow
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f0f7ff'
                        }
                      }}
                    >
                      <TableCell>
                        <TextField
                          select
                          name="productVersionId"
                          value={row.productVersionId}
                          onChange={(e) => onChangeRow(index, e)}
                          fullWidth
                          required
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>-- Chọn sản phẩm --</em>
                          </MenuItem>
                          {Array.isArray(productVersions) && productVersions.map((pv) => (
                            <MenuItem key={pv.versionId} value={pv.versionId}>
                              <Box>
                                <Typography variant="body2" fontWeight="600">
                                  {pv.productName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {pv.ramName} | {pv.romName} | {pv.colorName}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="systemQuantity"
                          type="number"
                          value={row.systemQuantity}
                          onChange={(e) => onChangeRow(index, e)}
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="quantity"
                          type="number"
                          value={row.quantity}
                          onChange={(e) => onChangeRow(index, e)}
                          fullWidth
                          size="small"
                          inputProps={{ min: 0 }}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={diff.text}
                          color={diff.color}
                          size="small"
                          sx={{
                            fontWeight: 'bold',
                            minWidth: 60
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="note"
                          value={row.note}
                          onChange={(e) => onChangeRow(index, e)}
                          fullWidth
                          size="small"
                          placeholder="Ghi chú..."
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => onRemoveRow(index)}
                          sx={{
                            color: '#d32f2f',
                            '&:hover': {
                              bgcolor: '#ffebee',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </Fade>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      {rows.length > 0 && (
        <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary">
            Tổng số sản phẩm: {rows.length}
          </Typography>
        </Box>
      )}
      
    </Paper>
  );
};

export default InventoryDetailsTable;