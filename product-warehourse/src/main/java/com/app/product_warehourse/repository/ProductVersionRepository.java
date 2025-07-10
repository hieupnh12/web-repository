package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Product;
import com.app.product_warehourse.entity.ProductVersion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVersionRepository extends JpaRepository<ProductVersion, String> {
//    List<ProductVersion> findByProductId(Long productId);

    List<ProductVersion> findByProduct(Product product);  // 👈 thêm dòng này

    @Query(value = """
    select * from product_version where version_id = ?
    """,nativeQuery = true)
    Optional<ProductVersion> getProductVersionById(String productVersionId);
}
