import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  TableContainer,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Person, Shield } from "@mui/icons-material";

export default function AccountTable({
  accounts,
  loading,
  onEdit,
  onDeleteRequest,
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: "0px 3px 15px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: "#2196f3" }}>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>No.</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Username</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
              Operation
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <CircularProgress size={32} />
              </TableCell>
            </TableRow>
          ) : accounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No accounts found.
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((acc, index) => (
              <TableRow
                key={acc.staffId}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f0f7ff",
                  "&:hover": {
                    backgroundColor: "#E8F3FE",
                  },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Person fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                  {acc.userName}
                </TableCell>
                <TableCell>
                  <Shield fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                  {acc.roleId}
                </TableCell>
                <TableCell>{acc.staff?.fullName || "N/A"}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(acc)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => onDeleteRequest(acc.staffId)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
    </TableContainer>
  );
}
