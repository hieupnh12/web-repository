import React from 'react';
import { TextField, MenuItem, Button, Grid } from '@mui/material';

const InventoryForm = ({ formData, onChange, onSubmit, employeeList, areaList, loading }) => {
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Nhân viên kiểm kê"
            name="createdId"
            value={formData.createdId}
            onChange={onChange}
            required
          >
            {employeeList.map((emp) => (
              <MenuItem key={emp.staffId} value={emp.staffId}>
                {emp.fullName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Khu vực kho"
            name="areaId"
            value={formData.areaId}
            onChange={onChange}
          >
            <MenuItem value="">-- Toàn bộ kho --</MenuItem>
            {areaList.map((area) => (
              <MenuItem key={area.id} value={area.id}>
                {area.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Lưu và tiếp tục'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default InventoryForm;