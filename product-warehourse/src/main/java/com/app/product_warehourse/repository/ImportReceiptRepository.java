package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.ImportReceiptFULLResponse;
import com.app.product_warehourse.entity.ImportReceipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ImportReceiptRepository extends JpaRepository<ImportReceipt, String> {

    @Query("SELECT i FROM ImportReceipt i " +
            "LEFT JOIN FETCH i.suppliers " +
            "LEFT JOIN FETCH i.staff " +
            "LEFT JOIN FETCH i.importReceiptDetails d " +
            "LEFT JOIN FETCH d.newid.productVersionId")
    Page<ImportReceipt> findAll(Pageable pageable);
}

