import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import { Close, Inventory } from "@mui/icons-material";

const WarehouseAreaDetailDialog = ({ area, onClose }) => {
  if (!area) return null;

  return (
    <Dialog open={!!area} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Chi tiết khu vực: {area.name}</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Ghi chú:
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="body2">{area.note || "Không có ghi chú"}</Typography>
        </Paper>

        <Typography variant="subtitle1" gutterBottom>
          Danh sách sản phẩm:
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {area.products && area.products.length > 0 ? (
            area.products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2">Số lượng: {product.quantity}</Typography>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Không có sản phẩm nào trong khu vực này.
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseAreaDetailDialog;
