package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.entity.ImportReceipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, String> {
    @Query("SELECT i FROM ExportReceipt i " +
            "LEFT JOIN FETCH i.customer " +
            "LEFT JOIN FETCH i.staff " +
            "LEFT JOIN FETCH i.exportReceiptDetails d " +
            "LEFT JOIN FETCH d.newExId.productVersionId")
    Page<ExportReceipt> findAll(Pageable pageable);
}
