import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Stack, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ImeiScanner from './components/ImeiScanner';
import ImeiListTable from './components/ImeiListTable';
import {
  getProductVersions,
  saveInventoryProductDetails,
  markMissingIMEI,
} from '../../services/inventoryService';

const IMEIScanPage = () => {
  const { inventoryId } = useParams();
  const [productVersions, setProductVersions] = useState([]);
  const [imeiList, setImeiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVersions = async () => {
      const versions = await getProductVersions();
      setProductVersions(versions);
      setLoading(false);
    };
    fetchVersions();
  }, []);

  const getVersionName = (id) => {
    return productVersions.find((p) => p.id === id)?.name || '';
  };

  const handleAddImei = (entry) => {
    if (imeiList.some((i) => i.imei === entry.imei)) {
      alert('IMEI này đã được thêm');
      return;
    }
    const withName = { ...entry, productVersionName: getVersionName(entry.productVersionId) };
    setImeiList((prev) => [...prev, withName]);
  };

  const handleDeleteImei = (index) => {
    setImeiList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await saveInventoryProductDetails(inventoryId, imeiList);
      navigate(`/inventory/summary/${inventoryId}`);
    } catch (err) {
      console.error('Lỗi khi lưu IMEI', err);
    }
  };

  const handleMarkMissing = async () => {
    const productIds = [...new Set(imeiList.map((i) => i.productVersionId))];
    try {
      for (const pid of productIds) {
        await markMissingIMEI(inventoryId, pid);
      }
      alert('Đã đánh dấu các IMEI thiếu');
    } catch (err) {
      console.error('Lỗi khi đánh dấu MISSING', err);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h6">Quét mã IMEI - Phiếu #{inventoryId}</Typography>
      <ImeiScanner productVersions={productVersions} onAddImei={handleAddImei} />
      <ImeiListTable imeiList={imeiList} onDelete={handleDeleteImei} />
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate(`/inventory/details/${inventoryId}`)}>
          Quay lại
        </Button>
        <Button variant="contained" color="warning" onClick={handleMarkMissing}>
          Đánh dấu MISSING
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Hoàn tất quét
        </Button>
      </Stack>
    </Container>
  );
};

export default IMEIScanPage;
