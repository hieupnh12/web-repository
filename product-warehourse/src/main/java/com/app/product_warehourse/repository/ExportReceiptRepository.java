package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.entity.ImportReceipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Repository
public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, String> {
    @Query("SELECT i FROM ExportReceipt i " +
            "LEFT JOIN FETCH i.customer " +
            "LEFT JOIN FETCH i.staff " +
            "LEFT JOIN FETCH i.exportReceiptDetails d " +
            "LEFT JOIN FETCH d.newExId.productVersionId")
    Page<ExportReceipt> findAll(Pageable pageable);




    @Query("SELECT i FROM ExportReceipt i " +
            "LEFT JOIN FETCH i.customer c " +
            "LEFT JOIN FETCH i.staff a " +
            "LEFT JOIN FETCH i.exportReceiptDetails d " +
            "LEFT JOIN FETCH d.newExId.productVersionId " +
            "WHERE (:customerName IS NULL OR LOWER(c.customerName) LIKE LOWER(CONCAT('%', :customerName, '%'))) " +
            "AND (:staffName IS NULL OR LOWER(a.userName) LIKE LOWER(CONCAT('%', :staffName, '%'))) " +
            "AND (:exportId IS NULL OR LOWER(i.export_id) LIKE LOWER(CONCAT('%', :exportId, '%'))) " +
            "AND (:startDate IS NULL OR i.exportTime >= :startDate) " +
            "AND (:endDate IS NULL OR i.exportTime <= :endDate) " +
            "ORDER BY i.exportTime DESC")
    Page<ExportReceipt> searchExportReceipts(
            @Param("customerName") String customerName,
            @Param("staffName") String staffName,
            @Param("exportId") String exportId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);




    @Modifying
    @Transactional
    @Query("DELETE FROM ExportReceipt e WHERE e.export_id = :exportId")
    void deleteByExportId(String exportId);


    @Modifying
    @Transactional
    @Query("DELETE FROM ExportReceiptDetail erd WHERE erd.newExId.export_id.export_id = :exportId")
    void deleteDetailsByExportId(String exportId);


    @Modifying
    @Transactional
    @Query("UPDATE ProductItem pi SET pi.export_id = null WHERE pi.export_id.export_id = :exportId")
    void resetExportIdByExportId(String exportId);


}
