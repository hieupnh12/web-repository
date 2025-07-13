
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
import { getAllOSs, createOS, updateOS, deleteOS } from "../../../services/attributeService";

const OSModal = ({ open, onClose }) => {
  const [osName, setOSName] = useState("");
  const [oss, setOSs] = useState([]);
  const [selectedOSId, setSelectedOSId] = useState(null);

  const fetchOSs = async () => {
    try {
      const res = await getAllOSs();
      setOSs(res.data.result || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách hệ điều hành:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOSs();
      setOSName("");
      setSelectedOSId(null);
    }
  }, [open]);

  const handleAdd = async () => {
    try {
      await createOS({ name: osName });
      fetchOSs();
      setOSName("");
    } catch (err) {
      console.error("Lỗi khi thêm hệ điều hành:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedOSId) return;
    try {
      await deleteOS(selectedOSId);
      fetchOSs();
      setOSName("");
      setSelectedOSId(null);
    } catch (err) {
      console.error("Lỗi khi xóa hệ điều hành:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedOSId) return;
    try {
      await updateOS(selectedOSId, { name: osName });
      fetchOSs();
      setOSName("");
      setSelectedOSId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật hệ điều hành:", err);
    }
  };

  const handleRowClick = (os) => {
    setSelectedOSId(os.id);
    setOSName(os.name);
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
        HỆ ĐIỀU HÀNH
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography fontWeight="bold" mb={1}>
          Tên hệ điều hành
        </Typography>
        <TextField
          fullWidth
          value={osName}
          onChange={(e) => setOSName(e.target.value)}
          placeholder="Nhập tên hệ điều hành"
          size="small"
          sx={{ mb: 3 }}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã</strong></TableCell>
              <TableCell><strong>Tên hệ điều hành</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {oss.map((os) => (
              <TableRow
                key={os.id}
                hover
                selected={os.id === selectedOSId}
                onClick={() => handleRowClick(os)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{os.id}</TableCell>
                <TableCell>{os.name}</TableCell>
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

export default OSModal;
