package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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




}
