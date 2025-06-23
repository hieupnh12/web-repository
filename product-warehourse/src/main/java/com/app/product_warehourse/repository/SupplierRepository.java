package com.app.product_warehourse.repository;


import com.app.product_warehourse.entity.Suppliers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Suppliers, String> {
}
