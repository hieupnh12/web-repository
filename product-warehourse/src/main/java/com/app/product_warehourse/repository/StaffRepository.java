package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, String> {
    Optional<Staff> findByFullName(String fullName);
    Optional<Staff> findByEmail(String email);
}
