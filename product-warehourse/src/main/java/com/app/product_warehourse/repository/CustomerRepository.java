package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    long countByStatus(Boolean status);
}
