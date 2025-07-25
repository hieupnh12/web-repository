import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Paper, Button
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const InventoryDetailsTable = ({
  rows,
  onAddRow,
  onRemoveRow,
  onChangeRow,
  productVersions,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Phiên bản sản phẩm</TableCell>
            <TableCell>Số lượng hệ thống</TableCell>
            <TableCell>Số lượng thực tế</TableCell>
            <TableCell>Ghi chú</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  select
                  name="productVersionId"
                  value={row.productVersionId}
                  onChange={(e) => onChangeRow(index, e)}
                  fullWidth
                  required
                >
                  {productVersions.map((pv) => (
                    <MenuItem key={pv.id} value={pv.id}>
                      {pv.name}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell>
                <TextField
                  name="systemQuantity"
                  type="number"
                  value={row.systemQuantity}
                  onChange={(e) => onChangeRow(index, e)}
                  fullWidth
                  inputProps={{ min: 0 }}
                  required
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="quantity"
                  type="number"
                  value={row.quantity}
                  onChange={(e) => onChangeRow(index, e)}
                  fullWidth
                  inputProps={{ min: 0 }}
                  required
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="note"
                  value={row.note}
                  onChange={(e) => onChangeRow(index, e)}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onRemoveRow(index)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onAddRow} sx={{ m: 2 }} variant="outlined">
        Thêm dòng
      </Button>
    </TableContainer>
  );
};

export default InventoryDetailsTable;
