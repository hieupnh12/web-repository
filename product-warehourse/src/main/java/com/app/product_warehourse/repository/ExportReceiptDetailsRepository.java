package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ExportReceiptDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExportReceiptDetailsRepository extends JpaRepository<ExportReceiptDetail, ExportReceiptDetail.ExportReceiptDetailId> {
    // Tìm ExportReceiptDetail dựa trên export_id và productVersionId
    @Query("SELECT erd FROM ExportReceiptDetail erd WHERE erd.newExId.export_id.export_id = :exportId AND erd.newExId.productVersionId.imei= :productVersionId")
    ExportReceiptDetail findByExportIdAndProductVersionId(@Param("exportId") String exportId, @Param("productVersionId") String imei);


    // Xóa ExportReceiptDetail dựa trên export_id và item_id
    @Modifying
    @Query("DELETE FROM ExportReceiptDetail erd WHERE erd.newExId.export_id.export_id = :exportId AND erd.newExId.productVersionId.imei = :productVersionId")
    void deleteByExportIdAndItemId(@Param("exportId")String exportId,@Param("productVersionId") String imei);


}
