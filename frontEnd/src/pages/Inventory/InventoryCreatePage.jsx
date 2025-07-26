import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress } from '@mui/material';
import InventoryForm from './components/InventoryForm';
import { useNavigate } from 'react-router-dom';
import { createInventory } from '../../services/inventoryService';
import { takeWarehouseAreaInven } from '../../services/storage';
import { fetchStaffListInven} from '../../services/staffService';


const InventoryCreatePage = () => {
  const [formData, setFormData] = useState({ createdId: '', areaId: '' });
  const [employeeList, setEmployeeList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdownData = async () => {
  try {
    const [emps, areas] = await Promise.all([
      fetchStaffListInven(),
      takeWarehouseAreaInven(),
    ]);

    console.log("StaffList from API:", emps);
    console.log("WarehouseAreas from API:", areas);

    setEmployeeList(emps);
    setAreaList(areas);
  } finally {
    setFetching(false);
  }
};

    fetchDropdownData();
  }, []);


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const inventoryRequest = {
        createdId: formData.createdId,
        areaId: formData.areaId || null,
        status: 1,
        inventoryDetails: [],
        inventoryProductDetails: []
      };
      const created = await createInventory(inventoryRequest);
      navigate(`/inventory/details/${created.id}`);
    } catch (error) {
      console.error('Tạo phiếu kiểm kê thất bại', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tạo phiếu kiểm kê mới
        </Typography>
        <InventoryForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          employeeList={employeeList}
          areaList={areaList}
          loading={loading}
        />
      </Paper>
    </Container>
  );
};

export default InventoryCreatePage;