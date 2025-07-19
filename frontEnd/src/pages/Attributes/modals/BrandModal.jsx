import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../../services/attributeService";

const BrandModal = ({ open, onClose }) => {
  const [brandName, setBrandName] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const fetchBrands = async () => {
    try {
      const res = await getAllBrands();
      setBrands(res || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBrands();
      setBrandName("");
      setSelectedBrandId(null);
    }
  }, [open]);

  const handleAdd = async () => {
    try {
      await createBrand({ name: brandName });
      fetchBrands();
      setBrandName("");
    } catch (err) {
      console.error("Lỗi khi thêm thương hiệu:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedBrandId) return;
    try {
      await deleteBrand(selectedBrandId);
      fetchBrands();
      setBrandName("");
      setSelectedBrandId(null);
    } catch (err) {
      console.error("Lỗi khi xóa thương hiệu:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedBrandId) return;
    try {
      await updateBrand(selectedBrandId, { name: brandName });
      fetchBrands();
      setBrandName("");
      setSelectedBrandId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật thương hiệu:", err);
    }
  };

  const handleRowClick = (brand) => {
    setSelectedBrandId(brand.id);
    setBrandName(brand.name);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          background: "linear-gradient(to right, #4a00e0, #8e2de2)",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Quản lý thương hiệu
      </DialogTitle>

      <DialogContent sx={{ py: 3, backgroundColor: "#f9f9f9" }}>
        <Typography fontWeight="bold" mb={1} color="primary">
          Tên thương hiệu
        </Typography>

        <TextField
          fullWidth
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Nhập tên thương hiệu"
          size="medium"
          sx={{ mb: 3 }}
          variant="outlined"
        />

        <Paper variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell><strong>Mã</strong></TableCell>
                <TableCell><strong>Tên thương hiệu</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.map((brand) => (
                <TableRow
                  key={brand.id}
                  hover
                  selected={brand.id === selectedBrandId}
                  onClick={() => handleRowClick(brand)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      brand.id === selectedBrandId ? "#e3f2fd" : "inherit",
                  }}
                >
                  <TableCell>{brand.idBrand}</TableCell>
                  <TableCell>{brand.brandName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Thêm
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Xóa
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={handleUpdate}
          >
            Sửa
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BrandModal;
