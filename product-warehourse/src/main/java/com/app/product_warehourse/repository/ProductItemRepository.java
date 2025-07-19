package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.ImeiResponse;
import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.entity.ExportReceiptDetail;
import com.app.product_warehourse.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, String> {

    // New query to find all imei by productVersionId
    @Query("SELECT p.imei FROM ProductItem p WHERE p.versionId.versionId = :productVersionId")
    List<String> findImeiByProductVersionId(@Param("productVersionId") String productVersionId);

    // Cập nhật exportId trong ProductItem dựa trên danh sách IMEI
    @Modifying
    @Query("UPDATE ProductItem pi SET pi.export_id = (SELECT er FROM ExportReceipt er WHERE er.export_id = :exportId), pi.status = TRUE WHERE pi.imei IN :imeis AND (pi.export_id IS NULL OR pi.export_id.export_id != :exportId)")
    void updateExportIdByImei(@Param("exportId") String exportId, @Param("imeis") List<String> imeis);



    long countByStatus(Boolean status);

    Optional<ProductItem> findByImei(String imei);

    @Query(value = """
    select * from product_item where imei = ?
    """,nativeQuery = true)
    Optional<ProductItem> getProductItemByImei(String imei);


}