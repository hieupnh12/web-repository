
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
} from "@mui/material";
import { getAllColors, createColor, updateColor, deleteColor } from "../../../services/attributeService";

const ColorModal = ({ open, onClose }) => {
  const [colorName, setColorName] = useState("");
  const [colors, setColors] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);

  const fetchColors = async () => {
    try {
      const res = await getAllColors();
      setColors(res.data.result || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách màu sắc:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchColors();
      setColorName("");
      setSelectedColorId(null);
    }
  }, [open]);

  const handleAdd = async () => {
    try {
      await createColor({ name: colorName });
      fetchColors();
      setColorName("");
    } catch (err) {
      console.error("Lỗi khi thêm màu sắc:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedColorId) return;
    try {
      await deleteColor(selectedColorId);
      fetchColors();
      setColorName("");
      setSelectedColorId(null);
    } catch (err) {
      console.error("Lỗi khi xóa màu sắc:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedColorId) return;
    try {
      await updateColor(selectedColorId, { name: colorName });
      fetchColors();
      setColorName("");
      setSelectedColorId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật màu sắc:", err);
    }
  };

  const handleRowClick = (color) => {
    setSelectedColorId(color.id);
    setColorName(color.name);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          backgroundColor: "#1976d2",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        MÀU SẮC
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography fontWeight="bold" mb={1}>
          Tên màu sắc
        </Typography>
        <TextField
          fullWidth
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder="Nhập tên màu sắc"
          size="small"
          sx={{ mb: 3 }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã</strong></TableCell>
              <TableCell><strong>Tên màu sắc</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colors.map((color) => (
              <TableRow
                key={color.id}
                hover
                selected={color.id === selectedColorId}
                onClick={() => handleRowClick(color)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{color.id}</TableCell>
                <TableCell>{color.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
          <Button variant="contained" color="success" onClick={handleAdd}>
            Thêm
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xóa
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Sửa
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ColorModal;
