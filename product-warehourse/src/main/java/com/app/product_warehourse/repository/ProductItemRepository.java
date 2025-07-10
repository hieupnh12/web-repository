package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ProductItem;
import com.app.product_warehourse.entity.ProductVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
    long countByStatus(Boolean status);

    Optional<ProductItem> findByImei(String imei);

    @Query(value = """
    select * from product_item where imei = ?
    """,nativeQuery = true)
    Optional<ProductItem> getProductItemByImei(String imei);
}
