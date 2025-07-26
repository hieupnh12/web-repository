import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
  InputAdornment,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { FileDown, RefreshCw, Search } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getRevenueByDateRange } from "../../../../services/statisticService";
import * as XLSX from "xlsx";

// Styled Components
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

const RevenueDatetoDate = () => {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!startDate || !endDate) {
      setError("Hãy nhập ngày bắt đầu và kết thúc.");
      setData([]);
      return;
    }

    try {
      const res = await getRevenueByDateRange(startDate, endDate);
      if (res.status === 200 && res.data?.code === 1000) {
        setData(res.data.result || []);
        setError(null);
      } else {
        setData([]);
        setError(res.data?.message || "Không tải được dữ liệu doanh thu.");
      }
    } catch (err) {
      console.error(err);
      setData([]);
      setError("Lỗi kết nối API.");
    }
  };

  const handleExportExcel = () => {
    const exportData = data.map((item, index) => ({
      STT: index + 1,
      Ngày: formatDate(item.date),
      "Chi phí": item.expenses.toLocaleString("vi-VN") + "đ",
      "Doanh thu": item.revenues.toLocaleString("vi-VN") + "đ",
      "Lợi nhuận": item.profits.toLocaleString("vi-VN") + "đ",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu từ ngày tới ngày");
    XLSX.writeFile(workbook, `doanhthu_tu_${startDate}_den_${endDate}.xlsx`);
  };

  const handleReset = () => {
    setStartDate(weekAgo);
    setEndDate(today);
    setError(null);
    fetchData();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toISOString().split("T")[0];
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, background: "linear-gradient(to bottom right, #f9fbfd, #e3f2fd)", minHeight: "100vh" }}>
      <StyledPaper sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
          Doanh thu từ ngày tới ngày
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            label="Từ ngày"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Đến ngày"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={fetchData} sx={{ borderRadius: 2 }}>
            Lọc
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReset}
            startIcon={<RefreshCw size={18} />}
            sx={{ borderRadius: 2 }}
          >
            Làm mới
          </Button>
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
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </StyledPaper>

<StyledPaper sx={{ mb: 3, p: 3 }}>
  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
    Biểu đồ doanh thu
  </Typography>
  <Box sx={{ width: "100%", height: 400 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis
          width={100}
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
          labelFormatter={(label) => `Ngày: ${label}`}
        />
        <Legend />
        <Area type="monotone" dataKey="revenues" stroke="#3b82f6" fill="url(#rev)" name="Doanh thu" />
        <Area type="monotone" dataKey="expenses" stroke="#f97316" fill="url(#cost)" name="Chi phí" />
        <Area type="monotone" dataKey="profits" stroke="#10b981" fill="url(#profit)" name="Lợi nhuận" />
      </AreaChart>
    </ResponsiveContainer>
  </Box>
</StyledPaper>


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
                paginatedData.map((item, idx) => (
                  <StyledTableRow key={item.date}>
                    <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.expenses?.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{item.revenues?.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>{item.profits?.toLocaleString("vi-VN")}đ</TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={data.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số hàng mỗi trang:"
          sx={{ borderTop: "1px solid #e0e0e0", backgroundColor: "#fafafa" }}
        />
      </StyledPaper>
    </Box>
  );
};

export default RevenueDatetoDate;
