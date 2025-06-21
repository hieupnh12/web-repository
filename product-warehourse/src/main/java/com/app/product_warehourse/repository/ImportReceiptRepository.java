package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ImportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ImportReceiptRepository extends JpaRepository<ImportReceipt, String> {
}
