package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Product;
import com.app.product_warehourse.entity.ProductVersion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVersionRepository extends JpaRepository<ProductVersion, String> {
    @Query("SELECT pv FROM ProductVersion pv LEFT JOIN FETCH pv.ram LEFT JOIN FETCH pv.rom LEFT JOIN FETCH pv.color WHERE pv.product = :product")
    List<ProductVersion> findByProduct(@Param("product") Product product);


//    @Query("SELECT pv FROM ProductVersion pv WHERE pv.product = :product")
//    List<ProductVersion> findByProductWithoutFetch(@Param("product") Product product);
}