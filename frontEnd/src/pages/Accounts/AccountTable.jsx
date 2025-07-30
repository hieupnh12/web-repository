import React from "react";
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";

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

const AccountTable = ({
  accounts = [],
  loading,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
}) => {
  return (
    <StyledPaper>
      <TableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Chức năng</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      <Skeleton animation="wave" height={60} />
                    </TableCell>
                  </TableRow>
                ))
              : accounts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((acc, index) => (
                    <StyledTableRow key={acc.staffId}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      {/* Tên đăng nhập */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon fontSize="small" color="primary" />
                          <Typography variant="body2" fontWeight={500}>
                            {acc.userName}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Vai trò */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BadgeIcon fontSize="small" />
                          {acc.roleName}
                        </Box>
                      </TableCell>

                      {/* Trạng thái mới đẹp */}
                      <TableCell>
                        {acc.status ? (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 1,
                              px: 1.5,
                              py: 0.5,
                              backgroundColor: "#4caf50",
                              color: "white",
                              borderRadius: "20px",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                            }}
                          >
                            <CheckCircle sx={{ fontSize: 18 }} />
                            Hoạt động
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 1,
                              px: 1.5,
                              py: 0.5,
                              backgroundColor: "#f44336",
                              color: "white",
                              borderRadius: "20px",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                            }}
                          >
                            <Cancel sx={{ fontSize: 18 }} />
                            Khóa
                          </Box>
                        )}
                      </TableCell>

                      {/* Chức năng */}
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            onClick={() => handleEdit?.(acc)}
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
                      </TableCell>
                    </StyledTableRow>
                  ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={accounts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang:"
        sx={{ borderTop: "1px solid #e0e0e0", backgroundColor: "#fafafa" }}
      />
    </StyledPaper>
  );
};

export default AccountTable;
