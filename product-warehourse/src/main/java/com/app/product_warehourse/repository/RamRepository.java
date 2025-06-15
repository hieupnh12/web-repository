package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Ram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RamRepository extends JpaRepository<Ram, Long> {
}
