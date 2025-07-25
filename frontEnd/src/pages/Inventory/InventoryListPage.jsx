import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getInventories} from '../../services/inventoryService';
import { takeWarehouseAreaInven } from '../../services/storage';
import { fetchStaffList} from '../../services/staffService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

const InventoryListPage = () => {
  const navigate = useNavigate();

  const [inventory, setInventories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [filters, setFilters] = useState({
    areaId: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [data, areaList, staffList] = await Promise.all([
        getInventories(filters),
        takeWarehouseAreaInven(),
        fetchStaffList(),
      ]);

    //   console.log("Danh sách kiểm kê:", data);
    // console.log("Danh sách khu vực:", areaList);
    // console.log("Danh sách nhân viên:", staffList);
      setInventories(data);
      setAreas(areaList);
      setStaffs(staffList);
    } catch (error) {
      console.error('Lỗi khi tải danh sách kiểm kê:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Đang kiểm kê';
      case 2:
        return 'Đã hoàn tất';
      default:
        return 'Không xác định';
    }
  };

  const getStaffName = (id) => staffs.find((s) => s.id === id)?.name || id;
  const getAreaName = (id) => areas.find((a) => a.id === id)?.name || 'Toàn kho';

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quản lý kiểm kê kho
        </Typography>

        {/* Bộ lọc */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            select
            name="areaId"
            label="Khu vực kho"
            value={filters.areaId}
            onChange={handleFilterChange}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {areas.map((area) => (
              <MenuItem key={area.id} value={area.id}>
                {area.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            name="status"
            label="Trạng thái"
            value={filters.status}
            onChange={handleFilterChange}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="1">Đang kiểm kê</MenuItem>
            <MenuItem value="2">Đã hoàn tất</MenuItem>
          </TextField>

          <TextField
            name="search"
            label="Tìm theo mã phiếu hoặc nhân viên"
            value={filters.search}
            onChange={handleFilterChange}
            sx={{ flexGrow: 1 }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/manager/inventory/create')}
          >
            Tạo phiếu kiểm kê
          </Button>
        </Stack>

        {/* Bảng danh sách */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã phiếu</TableCell>
              <TableCell>Nhân viên</TableCell>
              <TableCell>Khu vực</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((inv) => (
              <TableRow key={inv.inventoryId}>
                <TableCell>{inv.inventoryId}</TableCell>
                <TableCell>{getStaffName(inv.createdId)}</TableCell>
                <TableCell>{getAreaName(inv.areaId)}</TableCell>
                <TableCell>{inv.createdAt}</TableCell>
                <TableCell>{getStatusText(inv.status)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      if (inv.status === 1) {
                        navigate(`/manager/inventory/details/${inv.id}`);
                      } else {
                        navigate(`/manager/inventory/summary/${inv.id}`);
                      }
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default InventoryListPage;
