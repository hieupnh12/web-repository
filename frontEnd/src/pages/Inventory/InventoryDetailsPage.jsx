import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Paper, CircularProgress, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import InventoryDetailsTable from './components/InventoryDetailsTable';
import { getProductVersions, saveInventoryDetails } from '../../services/inventoryService';

const InventoryDetailsPage = () => {
  const { inventoryId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [productVersions, setProductVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      const versions = await getProductVersions();
      setProductVersions(versions);
      setLoading(false);
    };
    fetchVersions();
  }, []);

  const handleAddRow = () => {
    setRows((prev) => [...prev, { productVersionId: '', systemQuantity: 0, quantity: 0, note: '' }]);
  };

  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeRow = (index, e) => {
    const { name, value } = e.target;
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [name]: name === 'systemQuantity' || name === 'quantity' ? Number(value) : value } : row
      )
    );
  };

  const handleSubmit = async () => {
    try {
      await saveInventoryDetails(inventoryId, rows);
      navigate(`/inventory/scan/${inventoryId}`);
    } catch (err) {
      console.error('Lỗi khi lưu chi tiết kiểm kê', err);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Nhập chi tiết kiểm kê tổng quan - Phiếu #{inventoryId}
        </Typography>
        <InventoryDetailsTable
          rows={rows}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          onChangeRow={handleChangeRow}
          productVersions={productVersions}
        />
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/inventory')}>
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/inventory/summary/${inventoryId}`)}
          >
            Hoàn tất không quét IMEI
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Tiếp tục quét IMEI
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default InventoryDetailsPage;
