package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.StaffResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Staff;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, String> {
    Optional<Staff> findByFullName(String fullName);
    Optional<Staff> findByEmail(String email);
    boolean existsByEmail(String email);
    @EntityGraph(attributePaths = {"account", "account.role"})
    List<Staff> findAll();

    @Query("SELECT new com.app.product_warehourse.dto.response.StaffResponse(s.staffId, s.fullName, s.gender, s.birthDate, s.phoneNumber, s.email) " +
            "FROM Staff s")
    List<StaffResponse> findAllStaffResponse();
}
