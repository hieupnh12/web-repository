import React, { useState } from 'react';
import { TextField, MenuItem, Button, Grid } from '@mui/material';

const ImeiScanner = ({ productVersions, onAddImei }) => {
  const [form, setForm] = useState({
    productVersionId: '',
    imei: '',
    status: 'NEW',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imei || !form.productVersionId) return;
    onAddImei(form);
    setForm({ ...form, imei: '' }); // reset IMEI
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={5}>
          <TextField
            select
            label="Phiên bản sản phẩm"
            name="productVersionId"
            value={form.productVersionId}
            onChange={handleChange}
            fullWidth
            required
          >
            {productVersions.map((pv) => (
              <MenuItem key={pv.id} value={pv.id}>
                {pv.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="IMEI"
            name="imei"
            value={form.imei}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ maxLength: 20 }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            label="Trạng thái"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="NEW">Mới</MenuItem>
            <MenuItem value="DAMAGED">Hư</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Button variant="contained" type="submit" sx={{ height: '100%' }}>
            Thêm
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ImeiScanner;
