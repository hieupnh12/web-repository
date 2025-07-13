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
import { getAllOrigins, createOrigin, updateOrigin, deleteOrigin } from "../../../services/attributeService";

const OriginModal = ({ open, onClose }) => {
  const [originName, setOriginName] = useState("");
  const [origins, setOrigins] = useState([]);
  const [selectedOriginId, setSelectedOriginId] = useState(null);

  const fetchOrigins = async () => {
    try {
      const res = await getAllOrigins();
      setOrigins(res.data.result || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách xuất xứ:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOrigins();
      setOriginName("");
      setSelectedOriginId(null);
    }
  }, [open]);

  const handleAdd = async () => {
    try {
      await createOrigin({ name: originName });
      fetchOrigins();
      setOriginName("");
    } catch (err) {
      console.error("Lỗi khi thêm xuất xứ:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedOriginId) return;
    try {
      await deleteOrigin(selectedOriginId);
      fetchOrigins();
      setOriginName("");
      setSelectedOriginId(null);
    } catch (err) {
      console.error("Lỗi khi xóa xuất xứ:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedOriginId) return;
    try {
      await updateOrigin(selectedOriginId, { name: originName });
      fetchOrigins();
      setOriginName("");
      setSelectedOriginId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật xuất xứ:", err);
    }
  };

  const handleRowClick = (origin) => {
    setSelectedOriginId(origin.id);
    setOriginName(origin.name);
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
        XUẤT XỨ
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography fontWeight="bold" mb={1}>
          Tên xuất xứ
        </Typography>
        <TextField
          fullWidth
          value={originName}
          onChange={(e) => setOriginName(e.target.value)}
          placeholder="Nhập tên xuất xứ"
          size="small"
          sx={{ mb: 3 }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã</strong></TableCell>
              <TableCell><strong>Tên xuất xứ</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {origins.map((origin) => (
              <TableRow
                key={origin.id}
                hover
                selected={origin.id === selectedOriginId}
                onClick={() => handleRowClick(origin)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{origin.id}</TableCell>
                <TableCell>{origin.name}</TableCell>
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

export default OriginModal;
