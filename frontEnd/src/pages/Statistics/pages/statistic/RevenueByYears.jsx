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
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { getRevenueByYears } from "../../../../services/statisticService";

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

const RevenueByYears = () => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const years = [];
  for (let y = 2020; y <= currentYear; y++) years.push(y);

  useEffect(() => {
    fetchData(startYear, endYear);
  }, [startYear, endYear]);

  const fetchData = async (start, end) => {
    try {
      const res = await getRevenueByYears(start, end);
      if (res.status === 200) {
        setData(res.data.result || []);
        setError(null);
      } else {
        setData([]);
        setError(res.message || "Lỗi tải dữ liệu");
      }
    } catch (err) {
      setData([]);
      setError("Không thể kết nối đến server.");
    }
  };

  const handleExportExcel = () => {
    const exportData = data.map((item, index) => ({
      STT: index + 1,
      Năm: item.year,
      "Chi phí": item.expenses.toLocaleString("vi-VN") + "đ",
      "Doanh thu": item.revenues.toLocaleString("vi-VN") + "đ",
      "Lợi nhuận": item.profits.toLocaleString("vi-VN") + "đ"
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu theo năm");
    XLSX.writeFile(workbook, `thongke_doanhthu_nam_${startYear}_den_${endYear}.xlsx`);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, background: "linear-gradient(to bottom right, #f9fbfd, #e3f2fd)", minHeight: "100vh" }}>
      {/* Bộ lọc năm + export */}
      <StyledPaper sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" fontWeight={600} color="primary">
            Thống kê doanh thu từ năm {startYear} đến {endYear}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl size="small">
              <InputLabel>Từ năm</InputLabel>
              <Select
                value={startYear}
                label="Từ năm"
                onChange={(e) => setStartYear(Number(e.target.value))}
                sx={{ borderRadius: 2, backgroundColor: "white", minWidth: 100 }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    Năm {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>Đến năm</InputLabel>
              <Select
                value={endYear}
                label="Đến năm"
                onChange={(e) => setEndYear(Number(e.target.value))}
                sx={{ borderRadius: 2, backgroundColor: "white", minWidth: 100 }}
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
    Biểu đồ doanh thu theo năm
  </Typography>
  <Box sx={{ width: "100%", height: 400 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        
        <YAxis
          tickFormatter={(value) =>
            new Intl.NumberFormat("vi-VN", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
        />
        
        <Tooltip
          formatter={(value, name) => {
            const labelMap = {
              revenues: "Doanh thu",
              expenses: "Chi phí",
              profits: "Lợi nhuận",
            };
            return [
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(value),
              labelMap[name] || name,
            ];
          }}
          labelFormatter={(label) => `Năm ${label}`}
        />
        
        <Legend />
        <Bar dataKey="expenses" fill="#f97316" name="Chi phí" />
        <Bar dataKey="revenues" fill="#3b82f6" name="Doanh thu" />
        <Bar dataKey="profits" fill="#22c55e" name="Lợi nhuận" />
      </BarChart>
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
                <TableCell>Năm</TableCell>
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
                  <StyledTableRow key={item.year}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.year}</TableCell>
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
          rowsPerPageOptions={[5, 10, 25]}
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

export default RevenueByYears;
