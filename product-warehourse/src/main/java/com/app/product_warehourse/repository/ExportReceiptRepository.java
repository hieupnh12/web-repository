package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ExportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, String> {
}
