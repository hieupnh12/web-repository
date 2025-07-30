import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, Stack, Button, CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import InventorySummaryModal from './components/InventorySummaryModal';
import {
  getInventoryDetailsById,
  updateInventoryStatus,
  updateProductVersionStocks
} from '../../services/inventoryService';

const InventorySummaryPage = () => {
  const { inventoryId } = useParams();
  const navigate = useNavigate();
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [imeiDetails, setImeiDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventoryDetailsById(inventoryId);
        setInventoryDetails(data.inventoryDetails || []);
        setImeiDetails(data.inventoryProductDetails || []);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [inventoryId]);

  const handleUpdateStock = async () => {
    try {
      await updateProductVersionStocks(inventoryId);
      await handleFinish();
    } catch (err) {
      console.error('Lỗi cập nhật tồn kho', err);
    }
  };

  const handleFinish = async () => {
    try {
      await updateInventoryStatus(inventoryId, 2); // Hoàn tất
      setOpenConfirm(false);
      navigate('/manager/inventory');
    } catch (err) {
      console.error('Lỗi hoàn tất kiểm kê', err);
    }
  };

  const getTotalImeiByVersion = (versionId) =>
    imeiDetails.filter((i) => i.productVersionId === versionId).length;

  const hasDifference = inventoryDetails.some(
    (row) => row.quantity !== row.systemQuantity
  );

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Xác nhận kiểm kê - Phiếu #{inventoryId}
      </Typography>

      <Paper sx={{ mt: 2, p: 2 }}>
        <Typography variant="subtitle1">Tổng quan tồn kho</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phiên bản SP</TableCell>
              <TableCell>SL hệ thống</TableCell>
              <TableCell>SL thực tế</TableCell>
              <TableCell>Chênh lệch</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryDetails.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.productVersionName}</TableCell>
                <TableCell>{row.systemQuantity}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.quantity - row.systemQuantity}</TableCell>
                <TableCell>{row.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="subtitle1">Chi tiết IMEI</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>IMEI</TableCell>
              <TableCell>Phiên bản SP</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {imeiDetails.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.imei}</TableCell>
                <TableCell>{row.productVersionName}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate(`/manager/inventory/scan/${inventoryId}`)}>
          Quay lại quét IMEI
        </Button>
        <Button variant="contained" onClick={() => setOpenConfirm(true)}>
          Xác nhận & hoàn tất
        </Button>
      </Stack>

      <InventorySummaryModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onUpdateStock={handleUpdateStock}
        onFinishInventory={handleFinish}
        hasDifference={hasDifference}
      />
    </Container>
  );
};

export default InventorySummaryPage;
