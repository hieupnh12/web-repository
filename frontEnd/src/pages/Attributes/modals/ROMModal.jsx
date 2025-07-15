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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllROMs,
  createROM,
  updateROM,
  deleteROM,
} from "../../../services/attributeService";

const ROMModal = ({ open, onClose }) => {
  const [romName, setROMName] = useState("");
  const [roms, setROMs] = useState([]);
  const [selectedROMId, setSelectedROMId] = useState(null);

  const fetchROMs = async () => {
    try {
      const res = await getAllROMs();
      setROMs(res || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách ROM:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchROMs();
      setROMName("");
      setSelectedROMId(null);
    }
  }, [open]);

  const handleAdd = async () => {
    try {
      await createROM({ rom_size: romName });
      fetchROMs();
      setROMName("");
      toast.success("Thêm ROM thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm ROM:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedROMId) return;
    try {
      await deleteROM(selectedROMId);
      fetchROMs();
      setROMName("");
      setSelectedROMId(null);
    } catch (err) {
      console.error("Lỗi khi xóa ROM:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedROMId) return;
    try {
      await updateROM(selectedROMId, { rom_size: romName });
      fetchROMs();
      setROMName("");
      setSelectedROMId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật ROM:", err);
    }
  };

  const handleRowClick = (rom) => {
    setSelectedROMId(rom.rom_id);
    setROMName(rom.rom_size);
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
        ROM
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography fontWeight="bold" mb={1}>
          Tên ROM
        </Typography>
        <TextField
          fullWidth
          value={romName}
          onChange={(e) => setROMName(e.target.value)}
          placeholder="Nhập tên ROM"
          size="small"
          sx={{ mb: 3 }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Mã</strong>
              </TableCell>
              <TableCell>
                <strong>Tên ROM</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roms.map((rom) => (
              <TableRow
                key={rom.rom_id}
                hover
                selected={rom.rom_id === selectedROMId}
                onClick={() => handleRowClick(rom)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{rom.rom_id}</TableCell>
                <TableCell>{rom.rom_size}</TableCell>
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

export default ROMModal;
