package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    //JPA tự động general code cho các interface trong này , trừ các yêu cầu đặt biệt ra thì các tạo mới , thêm , xóa, .... có code sẵn hết
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.origin " +
            "LEFT JOIN FETCH p.brand " +
            "LEFT JOIN FETCH p.operatingSystem " +
            "LEFT JOIN FETCH p.warehouseArea " +
            "LEFT JOIN FETCH p.productVersion")
    Page<Product> findAllWithRelations(Pageable pageable);


    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.origin " +
            "LEFT JOIN FETCH p.brand " +
            "LEFT JOIN FETCH p.operatingSystem " +
            "LEFT JOIN FETCH p.warehouseArea " +
            "LEFT JOIN FETCH p.productVersion")
    List<Product> findAll();

    @Query("SELECT COALESCE(SUM(pv.stockQuantity), 0) FROM ProductVersion pv WHERE pv.product = :product")
    int calculateStockQuantity(@Param("product") Product product);


    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM product_version pv
        WHERE pv.product_id = :productId
        AND NOT EXISTS (
            SELECT 1 FROM product_item pi
            WHERE pi.product_version_id = pv.version_id
        )
    """, nativeQuery = true)
    void deleteProductVersionsWithoutItems(Long productId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Product p WHERE p.productId = :productId")
    void deleteProductById(Long productId);

    @Query("""
        SELECT COUNT(pi) > 0
        FROM ProductItem pi
        WHERE pi.versionId IN (
            SELECT pv FROM ProductVersion pv
            WHERE pv.product.productId = :productId
        )
    """)
    boolean hasProductItems(Long productId);

}
