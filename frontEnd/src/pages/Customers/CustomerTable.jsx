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
import { styled, alpha } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  QueryBuilder,
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

const CustomerTable = ({
  loading,
  filteredCustomers,
  page,
  rowsPerPage,
  totalElements,
  totalPages,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
  handleDeleteCustomer,
}) => {
  return (
    <StyledPaper>
      <StyledTableContainer className="min-h-[450px]">
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell align="center">Actions</TableCell>
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
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No customers found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer, index) => (
                <StyledTableRow key={customer.customerId}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>
                        {customer.customerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon color="action" fontSize="small" />
                      {customer.phone}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon color="action" fontSize="small" />
                      <Tooltip title={customer.address} placement="top">
                        <span>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {customer.address}
                          </Typography>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <QueryBuilder style={{ marginRight: 8 }} />
                    {new Date(customer.joinDate).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}{" "}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <Tooltip title="Edit" placement="top">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(customer)}
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
                      <Tooltip title="Delete" placement="top">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDeleteCustomer(customer.customerId)
                          }
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
      </StyledTableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalElements}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
        sx={{
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      />
    </StyledPaper>
  );
};

export default CustomerTable;
