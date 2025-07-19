
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
import { getAllRAMs, createRAM, updateRAM, deleteRAM } from "../../../services/attributeService";

const RAMModal = ({ open, onClose }) => {
  const [ramName, setRAMName] = useState("");
  const [rams, setRAMs] = useState([]);
  const [selectedRAMId, setSelectedRAMId] = useState(null);

  const fetchRAMs = async () => {
  try {
    const res = await getAllRAMs(); 
    setRAMs(res || []);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách RAM:", err);
  }
};


  useEffect(() => {
    if (open) {
      fetchRAMs();
      setRAMName("");
      setSelectedRAMId(null);
    }
  }, [open]);

  const handleAdd = async () => {
    try {
      await createRAM({ name: ramName });
      fetchRAMs();
      setRAMName("");
    } catch (err) {
      console.error("Lỗi khi thêm RAM:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedRAMId) return;
    try {
      await deleteRAM(selectedRAMId);
      fetchRAMs();
      setRAMName("");
      setSelectedRAMId(null);
    } catch (err) {
      console.error("Lỗi khi xóa RAM:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedRAMId) return;
    try {
      await updateRAM(selectedRAMId, { name: ramName });
      fetchRAMs();
      setRAMName("");
      setSelectedRAMId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật RAM:", err);
    }
  };

  const handleRowClick = (ram) => {
    setSelectedRAMId(ram.ram_id);
    setRAMName(ram.name);
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
        RAM
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography fontWeight="bold" mb={1}>
          Tên RAM
        </Typography>
        <TextField
          fullWidth
          value={ramName}
          onChange={(e) => setRAMName(e.target.value)}
          placeholder="Nhập tên RAM"
          size="small"
          sx={{ mb: 3 }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã</strong></TableCell>
              <TableCell><strong>Tên RAM</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rams.map((ram) => (
              <TableRow
                key={ram.ram_id}
                hover
                selected={ram.ram_id === selectedRAMId}
                onClick={() => handleRowClick(ram)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{ram.ram_id}</TableCell>
                <TableCell>{ram.name}</TableCell>
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

export default RAMModal;
