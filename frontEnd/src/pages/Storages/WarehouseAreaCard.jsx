import React from "react";
import {
  Card,
  Grid,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  CardActionArea,
} from "@mui/material";
import { Warehouse, CheckCircle, Cancel } from "@mui/icons-material";

const WarehouseAreaCard = ({ area, onClick }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        elevation={3}
        sx={{
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                sx={{
                  bgcolor: area.status ? "success.main" : "error.main",
                  mr: 2,
                }}
              >
                {area.status ? <CheckCircle /> : <Cancel />}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {area.name}
                </Typography>
                <Chip
                  size="small"
                  label={area.status ? "Hoạt động" : "Không hoạt động"}
                  color={area.status ? "success" : "default"}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {area.note || "Không có ghi chú"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default WarehouseAreaCard;
