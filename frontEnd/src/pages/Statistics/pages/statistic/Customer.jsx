// CustomerStatistic.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { getCustomerStatistic } from "../../../../services/statisticService";

// --- Styled Components ---
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

// --- Main Component ---
const CustomerStatistic = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCustomerStatistic();
        if (res?.code === 1000) {
          setCustomers(res.result || []);
          setError(null);
        } else {
          setCustomers([]);
          setError(res.message || "Không thể tải dữ liệu");
        }
      } catch (err) {
        console.error("Lỗi:", err);
        setError("Lỗi kết nối API");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter
  const filtered = customers.filter((c) =>
    c.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, background: "linear-gradient(to bottom right, #f9fbfd, #e3f2fd)", minHeight: "100vh" }}>
      <StyledPaper sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600} color="primary">
            <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Thống kê khách hàng
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm khách hàng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 300,
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
                backgroundColor: "white",
              },
            }}
          />
        </Box>
      </StyledPaper>

      {error && (
        <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: "#ffebee", color: "#c62828" }}>
          {error}
        </Box>
      )}

      <StyledPaper>
        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Tổng đơn hàng</TableCell>
                <TableCell>Tổng số tiền</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={6}>
                        <Skeleton animation="wave" height={60} />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedData.map((c, idx) => (
                    <StyledTableRow key={c.customerId}>
                      <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {c.customerName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <HomeIcon fontSize="small" />
                          {c.address || "N/A"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PhoneIcon fontSize="small" />
                          {c.phoneNumber}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ShoppingCartIcon fontSize="small" />
                          {c.amount}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <MonetizationOnIcon fontSize="small" />
                          {c.totalAmount}
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: "gray" }}>
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          sx={{ borderTop: "1px solid #e0e0e0", backgroundColor: "#fafafa" }}
        />
      </StyledPaper>
    </Box>
  );
};

export default CustomerStatistic;
