import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TableContainer,
  Tooltip,
  Box,
  TablePagination,
  Skeleton,
  Paper,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

// Styled như StaffTable
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%)",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(33, 150, 243, 0.1)",
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 12px 48px rgba(33, 150, 243, 0.2)",
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#2196f3",
  "& .MuiTableCell-head": {
    color: "white",
    fontWeight: 600,
    fontSize: "0.95rem",
    borderBottom: "none",
    padding: "16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    boxShadow: "0 4px 20px rgba(33, 150, 243, 0.1)",
  },
  transition: "all 0.3s ease",
}));

export default function AccountTable({
  accounts,
  loading,
  onEdit,
  onDeleteRequest,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pagedAccounts = accounts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <StyledPaper>
      <TableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Quyền</TableCell>
              <TableCell align="center">Chức năng</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={4}>
                      <Skeleton animation="wave" height={60} />
                    </TableCell>
                  </TableRow>
                ))
              : pagedAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Không có tài khoản nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedAccounts.map((acc, index) => (
                    <StyledTableRow key={acc.staffId}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {acc.userName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ShieldIcon fontSize="small" />
                          <Typography variant="body2">
                            {acc.roleId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          <Tooltip title="Sửa">
                            <IconButton
                              onClick={() => onEdit(acc)}
                              sx={{
                                color: "#2196f3",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.3s ease",
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xoá">
                            <IconButton
                              onClick={() => onDeleteRequest(acc.staffId)}
                              sx={{
                                color: "#f44336",
                                "&:hover": {
                                  backgroundColor: "#ffebee",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.3s ease",
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  ))
                )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={accounts.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Số hàng mỗi trang:"
        sx={{ borderTop: "1px solid #e0e0e0", backgroundColor: "#fafafa" }}
      />
    </StyledPaper>
  );
}
