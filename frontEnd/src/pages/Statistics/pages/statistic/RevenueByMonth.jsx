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
  TablePagination
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import * as XLSX from "xlsx";
import { FileDown } from "lucide-react";
import { getRevenueByMonth } from "../../../../services/statisticService";

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

const RevenueByMonth = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const years = [2022, 2023, 2024, 2025, 2026];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const normalizeData = (result) => {
    const monthMap = new Map(result.map(item => [item.month, item]));
    const fullYearData = [];
    for (let i = 1; i <= 12; i++) {
      fullYearData.push(monthMap.get(i) || { month: i, expenses: 0, revenues: 0, profits: 0 });
    }
    return fullYearData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRevenueByMonth(year);
        if (res.code === 1000) {
          setData(normalizeData(res.result));
          setError(null);
        } else {
          setData([]);
          setError(`Mã lỗi: ${res.code}`);
        }
      } catch (err) {
        setData([]);
        setError("Lỗi kết nối API hoặc không có dữ liệu.");
      }
    };
    fetchData();
  }, [year]);

  const handleExportExcel = () => {
    const exportData = data.map((item, index) => ({
      STT: index + 1,
      Tháng: `Tháng ${item.month}`,
      "Chi phí": item.expenses.toLocaleString("vi-VN") + "đ",
      "Doanh thu": item.revenues.toLocaleString("vi-VN") + "đ",
      "Lợi nhuận": item.profits.toLocaleString("vi-VN") + "đ"
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu theo tháng");
    XLSX.writeFile(workbook, `doanhthu_thang_nam_${year}.xlsx`);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, background: "linear-gradient(to bottom right, #f9fbfd, #e3f2fd)", minHeight: "100vh" }}>
      {/* Bộ lọc */}
      <StyledPaper sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" fontWeight={600} color="primary">
            Thống kê doanh thu theo tháng - Năm {year}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
              Xuất Excel
            </Button>
          </Box>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            Lỗi: {error}
          </Typography>
        )}
      </StyledPaper>

      {/* Biểu đồ */}
      <StyledPaper sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Biểu đồ doanh thu theo tháng
        </Typography>
        <Box sx={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={(m) => `Tháng ${m}`} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expenses" fill="#f97316" name="Chi phí" />
              <Bar dataKey="revenues" fill="#3b82f6" name="Doanh thu" />
              <Bar dataKey="profits" fill="#22c55e" name="Lợi nhuận" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </StyledPaper>

      {/* Bảng dữ liệu */}
      <StyledPaper>
        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tháng</TableCell>
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
                  <StyledTableRow key={item.month}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>Tháng {item.month}</TableCell>
                    <TableCell>{item.expenses.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{item.revenues.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{item.profits.toLocaleString("vi-VN")}đ</TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Phân trang */}
        <TablePagination
          rowsPerPageOptions={[4, 6, 12]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>
    </Box>
  );
};

export default RevenueByMonth;
