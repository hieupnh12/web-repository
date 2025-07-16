import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { FileDown } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { getRevenueByDay } from "../../../../services/statisticService";

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
  },
  transition: "all 0.3s ease",
}));

// --- Main Component ---
const RevenueByDay = () => {
  const current = new Date();
  const [year, setYear] = useState(current.getFullYear());
  const [month, setMonth] = useState(current.getMonth() + 1);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const months = [...Array(12)].map((_, i) => i + 1);
  const years = [2022, 2023, 2024, 2025, 2026];

  useEffect(() => {
    fetchData(year, month);
  }, [year, month]);

  const fetchData = async (y, m) => {
    try {
      const res = await getRevenueByDay(y, m);
      if (res.status === 200) {
        setData(res.data.result || []);
        setError(null);
        setPage(0); // Reset page khi reload
      } else {
        setData([]);
        setError(res.message || "Lỗi tải dữ liệu");
      }
    } catch (err) {
      setData([]);
      setError("Lỗi kết nối API");
    }
  };

  const handleExportExcel = () => {
    const exportData = data.map((item, index) => ({
      STT: index + 1,
      Ngày: item.date,
      "Chi phí": item.expenses.toLocaleString("vi-VN") + "đ",
      "Doanh thu": item.revenues.toLocaleString("vi-VN") + "đ",
      "Lợi nhuận": item.profits.toLocaleString("vi-VN") + "đ",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu theo ngày");
    XLSX.writeFile(workbook, `doanhthu_ngay_${month}_${year}.xlsx`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, background: "linear-gradient(to bottom right, #f9fbfd, #e3f2fd)", minHeight: "100vh" }}>
      {/* Bộ lọc */}
      <StyledPaper sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="h6" fontWeight={600} color="primary">
            Thống kê theo ngày - Tháng {month} / Năm {year}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl size="small">
              <InputLabel>Tháng</InputLabel>
              <Select
                value={month}
                label="Tháng"
                onChange={(e) => setMonth(Number(e.target.value))}
                sx={{ borderRadius: 2, backgroundColor: "white" }}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m}>
                    Tháng {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Năm</InputLabel>
              <Select
                value={year}
                label="Năm"
                onChange={(e) => setYear(Number(e.target.value))}
                sx={{ borderRadius: 2, backgroundColor: "white" }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    Năm {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="success"
              onClick={handleExportExcel}
              startIcon={<FileDown size={18} />}
              sx={{ borderRadius: 2 }}
            >
              Excel
            </Button>
          </Box>
        </Box>
        {error && <Typography color="error" sx={{ mt: 2 }}>Lỗi: {error}</Typography>}
      </StyledPaper>

      {/* Biểu đồ */}
      <StyledPaper sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Biểu đồ doanh thu theo ngày
        </Typography>
        <Box sx={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenues" stroke="#3b82f6" fill="url(#revenueColor)" name="Doanh thu" />
              <Area type="monotone" dataKey="expenses" stroke="#f97316" fill="url(#costColor)" name="Chi phí" />
              <Area type="monotone" dataKey="profits" stroke="#22c55e" fill="url(#profitColor)" name="Lợi nhuận" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </StyledPaper>

      {/* Bảng chi tiết */}
      <StyledPaper>
        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Chi phí</TableCell>
                <TableCell>Doanh thu</TableCell>
                <TableCell>Lợi nhuận</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: "gray" }}>
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <StyledTableRow key={item.date}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.expenses.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{item.revenues.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{item.profits.toLocaleString("vi-VN")}đ</TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
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

export default RevenueByDay;
