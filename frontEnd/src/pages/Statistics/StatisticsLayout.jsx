import React from "react";
import StatisticTabs from "./StatisticTabs";
import { Outlet } from "react-router-dom";

const StatisticsLayout = () => {
  return (
    <div className="p-4">
      <StatisticTabs />
      <Outlet />
    </div>
  );
};

export default StatisticsLayout;
