import { useQuery } from "@tanstack/react-query";
import { takeSearchImport } from "../../services/importService";
import ImportForm from "./components/ImportForm";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { takeFunctionOfFeature } from "../../services/permissionService";
import { useSelector } from "react-redux";

export default function ImportStock() {
  const [currentPageServer, setCurrentPageServer] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState({
    supplierName: "",
    staffName: "",
    importId: "",
    startDate: null,
    endDate: null,
  });

  const {
    data: importData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["imports", currentPageServer, filter],
    queryFn: async () => {
      console.log("fillter", filter);

      const resp = await takeSearchImport({
        supplierName: filter.supplierName,
        staffName: filter.staffName,
        importId: filter.importId,
        startDate: filter.startDate,
        endDate: filter.endDate,
        page: currentPageServer,
        size: 7,
      });
      console.log("trả về", resp);

      // Xử lý response từ hai API
      const data = resp.data.result || resp.data;
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
  const [permission, setPermission] = useState(null);

  const fetchPermission = async () => {
    try {
      const result = await takeFunctionOfFeature(6);
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
        functionId: 6,
        canView: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
      }));
    } else {
      fetchPermission();
    }
  }, []);

  useEffect(() => {
    if (importData?.totalPages) {
      setTotalPages(importData.totalPages);
    }
  }, [importData]);

  return (
    <ImportForm
      tableData={importData?.content || []}
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
  );
}
