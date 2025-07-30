import React, { useState, useMemo } from 'react';
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
  Fade,
  InputAdornment,
  Autocomplete,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  PhoneIphone as PhoneIcon,
  Memory as MemoryIcon
} from '@mui/icons-material';

const InventoryDetailsTable = ({
  rows,
  onAddRow,
  onRemoveRow,
  onChangeRow,
  productVersions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const uniqueProducts = useMemo(() => {
    if (!Array.isArray(productVersions)) return [];
    
    const productMap = new Map();
    productVersions.forEach(pv => {
      const productName = pv.productName || '';
      if (!productMap.has(productName)) {
        productMap.set(productName, {
          name: productName,
          versions: []
        });
      }
      productMap.get(productName).versions.push(pv);
    });
    
    return Array.from(productMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [productVersions]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return uniqueProducts;
    return uniqueProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [uniqueProducts, searchTerm]);

  const getVersionsForProduct = (productName) => {
    const product = uniqueProducts.find(p => p.name === productName);
    return product ? product.versions : [];
  };

  const getProductNameFromVersionId = (versionId) => {
    if (!versionId) return '';
    const version = productVersions.find(pv => pv.versionId === versionId);
    return version ? version.productName || '' : '';
  };

  const getDifference = (actual, system) => {
    const diff = actual - system;
    return {
      value: diff,
      color: diff > 0 ? 'success' : diff < 0 ? 'error' : 'default',
      text: diff > 0 ? `+${diff}` : diff.toString()
    };
  };

  const handleProductChange = (index, productName) => {
    onChangeRow(index, { 
      target: { 
        name: 'productVersionId', 
        value: '' 
      } 
    });

    onChangeRow(index, { 
      target: { 
        name: 'selectedProduct', 
        value: productName 
      } 
    });
  };

  const handleVersionChange = (index, versionId) => {
    onChangeRow(index, { 
      target: { 
        name: 'productVersionId', 
        value: versionId 
      } 
    });

    if (versionId) {
      const version = productVersions.find(pv => pv.versionId === versionId);
      if (version) {
        onChangeRow(index, { 
          target: { 
            name: 'systemQuantity', 
            value: version.stockQuantity || 0 
          } 
        });
      }
    }
  };

  // Mobile Card View
  const renderMobileCard = (row, index) => {
    const diff = getDifference(row.quantity || 0, row.systemQuantity || 0);
    const selectedProductName = row.selectedProduct || getProductNameFromVersionId(row.productVersionId);
    const availableVersions = getVersionsForProduct(selectedProductName);
    
    return (
      <Fade in={true} timeout={300 + index * 100} key={index}>
        <Card 
          elevation={0} 
          sx={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: 2, 
            mb: 2,
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Typography variant="subtitle2" fontWeight="600" color="primary">
                Sản phẩm #{index + 1}
              </Typography>
              {rows.length > 1 && (
                <IconButton
                  onClick={() => onRemoveRow(index)}
                  size="small"
                  sx={{
                    color: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#ffebee'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={2}>
              {/* Product Selection */}
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  options={filteredProducts}
                  getOptionLabel={(option) => option.name}
                  value={filteredProducts.find(p => p.name === selectedProductName) || null}
                  onChange={(event, newValue) => {
                    handleProductChange(index, newValue ? newValue.name : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn sản phẩm"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: '#666', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon sx={{ color: '#1976d2', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight="600">
                          {option.name}
                        </Typography>
                        <Chip 
                          label={`${option.versions.length} phiên bản`} 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </Box>
                  )}
                  noOptionsText="Không tìm thấy sản phẩm"
                />
              </Grid>

              {/* Version Selection */}
              <Grid item xs={12}>
                <TextField
                  select
                  name="productVersionId"
                  label="Phiên bản"
                  value={row.productVersionId}
                  onChange={(e) => handleVersionChange(index, e.target.value)}
                  fullWidth
                  size="small"
                  disabled={!selectedProductName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>-- Chọn phiên bản --</em>
                  </MenuItem>
                  {availableVersions.map((version) => (
                    <MenuItem key={version.versionId} value={version.versionId}>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <MemoryIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                          <Typography variant="body2" fontWeight="600">
                            {version.ramName} | {version.romName} | {version.colorName}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Tồn kho: {version.stockQuantity || 0} | Giá: {version.exportPrice?.toLocaleString('vi-VN')}đ
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Quantities */}
              <Grid item xs={6}>
                <TextField
                  name="systemQuantity"
                  label="SL hệ thống"
                  type="number"
                  value={row.systemQuantity}
                  onChange={(e) => onChangeRow(index, e)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="quantity"
                  label="SL thực tế"
                  type="number"
                  value={row.quantity}
                  onChange={(e) => onChangeRow(index, e)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Difference */}
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary">
                    Chênh lệch:
                  </Typography>
                  <Chip
                    label={diff.text}
                    color={diff.color}
                    size="small"
                    sx={{
                      fontWeight: 'bold',
                      minWidth: 60
                    }}
                  />
                </Box>
              </Grid>

              {/* Note */}
              <Grid item xs={12}>
                <TextField
                  name="note"
                  label="Ghi chú"
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
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
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
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
              }
            }}
          >
            Thêm sản phẩm
          </Button>
        </Box>

        {/* Search Box */}
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: 'white'
            },
          }}
        />
      </Box>

      {/* Content */}
      {rows.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <InventoryIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có sản phẩm nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nhấn "Thêm sản phẩm" để bắt đầu
          </Typography>
        </Box>
      ) : isMobile ? (
        // Mobile View - Cards
        <Box sx={{ p: 2 }}>
          {rows.map((row, index) => renderMobileCard(row, index))}
        </Box>
      ) : (
        // Desktop View - Table
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, minWidth: 200 }}>
                  Sản phẩm
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, minWidth: 250 }}>
                  Phiên bản
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, width: 120 }}>
                  SL hệ thống
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, width: 120 }}>
                  SL thực tế
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, width: 100 }}>
                  Chênh lệch
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, minWidth: 180 }}>
                  Ghi chú
                </TableCell>
                <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 700, width: 80, textAlign: 'center' }}>
                  Xóa
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                const diff = getDifference(row.quantity || 0, row.systemQuantity || 0);
                const selectedProductName = row.selectedProduct || getProductNameFromVersionId(row.productVersionId);
                const availableVersions = getVersionsForProduct(selectedProductName);
                
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
                        <Autocomplete
                          size="small"
                          options={filteredProducts}
                          getOptionLabel={(option) => option.name}
                          value={filteredProducts.find(p => p.name === selectedProductName) || null}
                          onChange={(event, newValue) => {
                            handleProductChange(index, newValue ? newValue.name : '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Chọn sản phẩm"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon sx={{ color: '#666', fontSize: 18 }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <PhoneIcon sx={{ color: '#1976d2', fontSize: 18 }} />
                                <Typography variant="body2" fontWeight="600">
                                  {option.name}
                                </Typography>
                                <Chip 
                                  label={`${option.versions.length} phiên bản`} 
                                  size="small" 
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            </Box>
                          )}
                          noOptionsText="Không tìm thấy sản phẩm"
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          select
                          name="productVersionId"
                          value={row.productVersionId}
                          onChange={(e) => handleVersionChange(index, e.target.value)}
                          fullWidth
                          size="small"
                          disabled={!selectedProductName}
                          placeholder="Chọn phiên bản"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>-- Chọn phiên bản --</em>
                          </MenuItem>
                          {availableVersions.map((version) => (
                            <MenuItem key={version.versionId} value={version.versionId}>
                              <Box>
                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                  <MemoryIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                                  <Typography variant="body2" fontWeight="600">
                                    {version.ramName} | {version.romName} | {version.colorName}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  Tồn kho: {version.stockQuantity || 0} | Giá: {version.exportPrice?.toLocaleString('vi-VN')}đ
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
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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