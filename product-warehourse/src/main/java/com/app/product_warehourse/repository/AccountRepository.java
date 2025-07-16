package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.StaffResponse;
import com.app.product_warehourse.dto.response.StaffSelectResponse;
import com.app.product_warehourse.entity.Account;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {
    @EntityGraph(attributePaths = {"role"})
    Optional<Account> findByUserName(String userName);
    boolean existsByUserName(String userName);


    @EntityGraph(attributePaths = {"role"})
    List<Account> findAll();

    @Query(value = """
    SELECT s.staff_id,
           s.full_name
    FROM staff s
    LEFT JOIN account a ON s.staff_id = a.staff_id
    WHERE a.staff_id IS NULL AND s.status = TRUE
    """, nativeQuery = true)
    List<StaffSelectResponse> getStaff();


}
