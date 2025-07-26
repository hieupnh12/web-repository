import React, { useEffect, useState } from "react";
import ExportForm from "./components/ExportForm";
import {
  fetchFullExportReceipts,
  takeSearchExport,
} from "../../services/exportService";
import useSmartFilter from "../../hooks/useSmartFilter";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { takeFunctionOfFeature } from "../../services/permissionService";
import { useSelector } from "react-redux";

export default function ExportStock() {
  const [currentPageServer, setCurrentPageServer] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState({
    customerName: "",
    staffName: "",
    exportId: "",
    startDate: null,
    endDate: null,
  });

  const {
    data: exportData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["exports", currentPageServer, filter],
    queryFn: async () => {
      console.log("fillter", filter);

      const resp = await takeSearchExport({
        customerName: filter.customerName,
        staffName: filter.staffName,
        exportId: filter.exportId,
        startDate: filter.startDate,
        endDate: filter.endDate,
        page: currentPageServer,
        size: 7,
      });
      console.log("trả về Ex", resp);

      // Xử lý response từ hai API
      const data = resp.data;
      if (!data?.content) {
        throw new Error("Invalid response format");
      }
      return data;
    },
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    onError: (error) => {
      console.error("Error fetching imports:", error);
      toast.error("Không thể tải danh sách phiếu nhập!");
    },
  });

  useEffect(() => {
    if (exportData?.totalPages) {
      setTotalPages(exportData.totalPages);
    }
  }, [exportData]);

  const [permission, setPermission] = useState(null);

  const fetchPermission = async () => {
    try {
      const result = await takeFunctionOfFeature(7);
      console.log("Quyền", result);

      setPermission(result.data.result[0]);
    } catch (err) {
      setPermission(null);
    }
  };

  const staffInfo = useSelector((state) => state.auth.userInfo);
  console.log("dd", staffInfo);
  useEffect(() => {
    if (staffInfo && staffInfo.roleName === "ADMIN") {
      // Admin có toàn quyền, gán trực tiếp
      setPermission(() => ({
        functionId: 7,
        canView: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
      }));
    } else {
      fetchPermission();
    }
  }, []);

  return (
    <>
      <ExportForm
        tableData={exportData?.content || []}
        filter={filter}
        onFilterChange={setFilter}
        onReload={refetch}
        currentPage={currentPageServer}
        totalPages={totalPages}
        onPageChange={setCurrentPageServer}
        isLoading={isLoading}
        isError={isError}
        isPermission={permission}
      />
    </>
  );
}
