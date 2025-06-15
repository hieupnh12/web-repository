package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Product;
import com.app.product_warehourse.entity.ProductVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVersionRepository extends JpaRepository<ProductVersion, String> {
//    List<ProductVersion> findByProductId(Long productId);

    List<ProductVersion> findByProduct(Product product);  // 👈 thêm dòng này


}
