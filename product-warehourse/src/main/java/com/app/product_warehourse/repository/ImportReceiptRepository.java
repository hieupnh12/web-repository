package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.ImportReceiptFULLResponse;
import com.app.product_warehourse.entity.ImportReceipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface ImportReceiptRepository extends JpaRepository<ImportReceipt, String> {

    @Query("SELECT i FROM ImportReceipt i " +
            "LEFT JOIN FETCH i.suppliers " +
            "LEFT JOIN FETCH i.staff " +
            "LEFT JOIN FETCH i.importReceiptDetails d " +
            "LEFT JOIN FETCH d.newid.productVersionId " +
            "ORDER BY i.time DESC")
    Page<ImportReceipt> findAll(Pageable pageable);

    // Kiểm tra xem có ProductItem nào với export_id không NULL
    @Query("SELECT COUNT(pi) > 0 FROM ProductItem pi WHERE pi.import_id.import_id = :importId AND pi.export_id IS NOT NULL")
    boolean hasProductItemsWithExportId(@Param("importId") String importId);

    // Gộp xóa trong một stored procedure
//    @Modifying
//    @Transactional
//    @Query(value = "CALL DeleteImportIfNoExport(:importId)", nativeQuery = true)
//    void deleteImportReceiptIfNoExport(@Param("importId") String importId);


    // Xóa ProductItem theo import_id
    @Modifying
    @Transactional
    @Query("DELETE FROM ProductItem pi WHERE pi.import_id.import_id = :importId")
    void deleteProductItemsByImportId(@Param("importId") String importId);

    // Xóa ImportReceiptDetail theo import_id
    @Modifying
    @Transactional
    @Query("DELETE FROM ImportReceiptDetail ird WHERE ird.newid.import_id.import_id = :importId")
    void deleteImportReceiptDetailsByImportId(@Param("importId") String importId);

    // Xóa ImportReceipt theo import_id
    @Modifying
    @Transactional
    @Query("DELETE FROM ImportReceipt i WHERE i.import_id = :importId")
    void deleteByImportId(@Param("importId") String importId);



    @Query("SELECT i FROM ImportReceipt i " +
            "LEFT JOIN FETCH i.suppliers s " +
            "LEFT JOIN FETCH i.staff a " +
            "LEFT JOIN FETCH i.importReceiptDetails d " +
            "LEFT JOIN FETCH d.newid.productVersionId " +
            "WHERE (:supplierName IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :supplierName, '%'))) " +
            "AND (:staffName IS NULL OR LOWER(a.userName) LIKE LOWER(CONCAT('%', :staffName, '%'))) " +
            "AND (:importId IS NULL OR LOWER(i.import_id) LIKE LOWER(CONCAT('%', :importId, '%'))) " +
            "AND (:startDate IS NULL OR i.time >= :startDate) " +
            "AND (:endDate IS NULL OR i.time <= :endDate) " +
            "ORDER BY i.time DESC")
    Page<ImportReceipt> searchImportReceipts(
            @Param("supplierName") String supplierName,
            @Param("staffName") String staffName,
            @Param("importId") String importId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);





}

