import React, { useEffect, useState } from "react";
import { takeWarehouseArea, takeWarehouseAreaById } from "../../services/storage";
import { Container, Grid, Snackbar, Alert } from "@mui/material";
import WarehouseAreaCard from "./WarehouseAreaCard";
import WarehouseAreaDetailDialog from "./WarehouseAreaDetailDialog";
import WarehouseAreaSkeleton from "./WarehouseAreaSkeleton";

const WarehouseAreaPage = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const res = await takeWarehouseArea();
      setAreas(res.data || []);
    } catch (err) {
      setSnackbar({ open: true, message: "Lỗi tải danh sách khu vực", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const openAreaDetail = async (id) => {
    try {
      const res = await takeWarehouseAreaById(id);
      setSelectedArea(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: "Lỗi tải chi tiết khu vực", severity: "error" });
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {loading ? (
          <WarehouseAreaSkeleton />
        ) : (
          areas.map((area) => (
            <WarehouseAreaCard key={area.id} area={area} onClick={() => openAreaDetail(area.id)} />
          ))
        )}
      </Grid>
      <WarehouseAreaDetailDialog area={selectedArea} onClose={() => setSelectedArea(null)} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default WarehouseAreaPage;
