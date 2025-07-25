import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, IconButton, Paper, TableContainer } from '@mui/material';
import { Delete } from '@mui/icons-material';

const ImeiListTable = ({ imeiList, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>IMEI</TableCell>
            <TableCell>Phiên bản sản phẩm</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {imeiList.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.imei}</TableCell>
              <TableCell>{item.productVersionName}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                <IconButton onClick={() => onDelete(index)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ImeiListTable;
