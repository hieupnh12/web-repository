import React from "react";
import {
  Box,
  Typography,
  Chip,
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
import { empf, alpha, styled } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#2196f3",
    borderRadius: "10px",
    "&:hover": {
      background: "#1976d2",
    },
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
  cursor: "pointer",
}));

const SupplierTable = ({
  loading,
  filteredSuppliers,
  page,
  rowsPerPage,
  totalElements,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
  handleDeleteSupplier,
  isPermission,
}) => {
  return (
    <StyledPaper>
      <StyledTableContainer className="min-h-[450px]">
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên Nhà Cung Cấp</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số Điện Thoại</TableCell>
              <TableCell>Địa Chỉ</TableCell>
              <TableCell align="center">Trạng Thái</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={7}>
                    <Skeleton animation="wave" height={60} />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Không tìm thấy nhà cung cấp</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier, index) => (
                <StyledTableRow key={supplier.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>
                        {supplier.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon color="action" fontSize="small" />
                      {supplier.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon color="action" fontSize="small" />
                      {supplier.phone}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon color="action" fontSize="small" />
                      <Tooltip title={supplier.address} placement="top">
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: 200 }}
                        >
                          {supplier.address}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip>
                      <span>
                        <Chip
                          label={supplier.status ? "Hoạt động" : "Khóa"}
                          color={supplier.status ? "success" : "error"}
                          size="small"
                          icon={
                            supplier.status ? (
                              <CheckCircleIcon />
                            ) : (
                              <CancelIcon />
                            )
                          }
                          sx={{ fontWeight: 500, pointerEvents: "none" }}
                        />
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Xem chi tiết" placement="top">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(supplier)}
                            disabled={!isPermission?.canUpdate}
                            sx={{
                              color: "#2196f3",
                              opacity: isPermission?.canUpdate ? 1 : 0.4,
                              cursor: isPermission?.canUpdate
                                ? "pointer"
                                : "not-allowed",
                              "&:hover": {
                                backgroundColor: isPermission?.canUpdate
                                  ? "#e3f2fd"
                                  : "transparent",
                                transform: isPermission?.canUpdate
                                  ? "scale(1.1)"
                                  : "none",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Xóa" placement="top">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            disabled={!isPermission?.canDelete}
                            sx={{
                              color: "#f44336",
                              opacity: isPermission?.canDelete ? 1 : 0.4,
                              cursor: isPermission?.canDelete
                                ? "pointer"
                                : "not-allowed",
                              "&:hover": {
                                backgroundColor: isPermission?.canDelete
                                  ? "#ffebee"
                                  : "transparent",
                                transform: isPermission?.canDelete
                                  ? "scale(1.1)"
                                  : "none",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalElements}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trong số ${count !== -1 ? count : `hơn ${to}`}`
        }
        sx={{
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      />
    </StyledPaper>
  );
};

export default SupplierTable;
