import { useQuery } from '@tanstack/react-query';
import { takeSearchImport } from '../../services/importService';
import ImportForm from './components/ImportForm';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

export default function ImportStock() {
  const [currentPageServer, setCurrentPageServer] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState({
    supplierName: '',
    staffName: '',
    importId: '',
    startDate: null,
    endDate: null,
  });

  const {
    data: importData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['imports', currentPageServer, filter],
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
      console.log("trả về",resp);
      
      // Xử lý response từ hai API
      const data = resp.data.result || resp.data;
      if (!data?.content) {
        throw new Error('Invalid response format');
      }
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    onError: (error) => {
      console.error('Error fetching imports:', error);
      toast.error('Không thể tải danh sách phiếu nhập!');
    },
  });

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
    />
  );
}