package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ProductVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVersionRepository extends JpaRepository<ProductVersion, String> {
}
