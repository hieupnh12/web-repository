package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    //JPA tự động general code cho các interface trong này , trừ các yêu cầu đặt biệt ra thì các tạo mới , thêm , xóa, .... có code sẵn hết

}
