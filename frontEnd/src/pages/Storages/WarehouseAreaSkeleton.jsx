import React from "react";
import { Grid, Card, CardContent, Skeleton } from "@mui/material";

const WarehouseAreaSkeleton = () => {
  return Array.from(new Array(6)).map((_, idx) => (
    <Grid item xs={12} sm={6} md={4} key={idx}>
      <Card>
        <CardContent>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="80%" height={28} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    </Grid>
  ));
};

export default WarehouseAreaSkeleton;
