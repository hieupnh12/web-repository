package com.app.product_warehourse.repository;


import com.app.product_warehourse.entity.Rom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RomRepository extends JpaRepository<Rom, Long> {
}
