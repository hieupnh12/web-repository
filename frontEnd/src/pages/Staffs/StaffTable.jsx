// StaffTable.jsx
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
import { styled, alpha } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

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

const StaffTable = ({
  loading,
  filteredStaffs,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
  handleDeleteRequest,
}) => {
  return (
    <StyledPaper>
      <TableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Họ & Tên</TableCell>
              <TableCell>Giới Tính</TableCell>
              <TableCell>Ngày Sinh</TableCell>
              <TableCell>SDT</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Chức Năng</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7}>
                      <Skeleton animation="wave" height={60} />
                    </TableCell>
                  </TableRow>
                ))
              : filteredStaffs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((staff, index) => (
                    <StyledTableRow key={staff.staffId}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {staff.fullName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{staff.gender === true || staff.gender === "1" ? "Nam" : "Nữ"}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarIcon fontSize="small" />
                          {staff.birthDate || "N/A"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PhoneIcon fontSize="small" />
                          {staff.phoneNumber}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <EmailIcon fontSize="small" />
                          {staff.email}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          <Tooltip title="Sửa">
                            <IconButton
                              onClick={() => handleEdit(staff)}
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
                              onClick={() => handleDeleteRequest(staff.staffId)}
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
                  ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStaffs.length}
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

export default StaffTable;
