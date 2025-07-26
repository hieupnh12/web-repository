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
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    //JPA tự động general code cho các interface trong này , trừ các yêu cầu đặt biệt ra thì các tạo mới , thêm , xóa, .... có code sẵn hết
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.origin " +
            "LEFT JOIN FETCH p.brand " +
            "LEFT JOIN FETCH p.operatingSystem " +
            "LEFT JOIN FETCH p.warehouseArea " +
            "LEFT JOIN FETCH p.productVersion " +
            " ORDER BY p.productId DESC" )
    Page<Product> findAllWithRelations(Pageable pageable);


    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.origin " +
            "LEFT JOIN FETCH p.brand " +
            "LEFT JOIN FETCH p.operatingSystem " +
            "LEFT JOIN FETCH p.warehouseArea " +
            "LEFT JOIN FETCH p.productVersion " +
            " ORDER BY p.productId DESC" )
    Page<Product> findProductsWithRelations(Pageable pageable);








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

    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.origin o " +
            "LEFT JOIN FETCH p.brand  b " +
            "LEFT JOIN FETCH p.operatingSystem os " +
            "LEFT JOIN FETCH p.warehouseArea  w " +
            "LEFT JOIN FETCH p.productVersion  pv " +
           "WHERE (:brandName IS NULL OR LOWER( b.brandName) LIKE LOWER(CONCAT('%', :brandName, '%')))  " +
            "AND (:warehouseAreaName IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :warehouseAreaName, '%'))) " +
            "AND (:originName IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :originName, '%')))" +
            "AND (:operatingSystemName IS NULL OR LOWER(os.name) LIKE LOWER(CONCAT('%', :operatingSystemName, '%'))) " +
            "AND (:productName IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%')))"  +
             "ORDER BY p.productId DESC ")
    Page<Product> findProductsWithFilters(
            @Param("brandName")String brandName ,
            @Param("warehouseAreaName") String warehouseAreaName ,
            @Param("originName") String originName ,
            @Param("operatingSystemName") String operatingSystemName ,
            @Param("productName") String productName,
            Pageable pageable
    );


    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.origin " +
            "LEFT JOIN FETCH p.brand " +
            "LEFT JOIN FETCH p.operatingSystem " +
            "LEFT JOIN FETCH p.warehouseArea " +
            "LEFT JOIN FETCH p.productVersion pv " +
            "WHERE EXISTS (SELECT pi FROM ProductItem pi " +
            "WHERE pi.versionId = pv AND pi.imei = :imei AND pi.export_id IS NULL)")
    Optional<Product> findByImei(String imei);

}
