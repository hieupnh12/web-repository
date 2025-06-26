package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.ImportReceiptDetailsResponse;
import com.app.product_warehourse.entity.ImportReceiptDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ImportReceiptDetailsRespository extends JpaRepository<ImportReceiptDetail, ImportReceiptDetail.ImportReceiptDetailId> {

    @Query("SELECT ird FROM ImportReceiptDetail ird WHERE ird.newid.id.import_id = :importId AND ird.newid.productVersionId.versionId = :productVersionId")
    ImportReceiptDetail findByImportIdAndProductVersionId(@Param("importId") String importId, @Param("productVersionId") String productVersionId);



    @Transactional
    @Modifying
    @Query("DELETE FROM ImportReceiptDetail ird WHERE ird.newid.id.import_id = :importId AND ird.newid.productVersionId.versionId = :productVersionId")
    void deleteByImportIdAndProductVersionId(@Param("importId") String importId, @Param("productVersionId") String productVersionId);

}