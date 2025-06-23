package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
}