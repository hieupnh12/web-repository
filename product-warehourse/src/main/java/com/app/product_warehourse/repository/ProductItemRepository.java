package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ExportReceiptDetail;
import com.app.product_warehourse.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, String> {
    long countByStatus(Boolean status);

    // New query to find all imei by productVersionId
    @Query("SELECT p.imei FROM ProductItem p WHERE p.versionId.versionId = :productVersionId")
    List<String> findImeiByProductVersionId(@Param("productVersionId") String productVersionId);



}