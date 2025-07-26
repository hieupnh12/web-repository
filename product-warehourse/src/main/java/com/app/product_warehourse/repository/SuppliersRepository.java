package com.app.product_warehourse.repository;


import com.app.product_warehourse.entity.Suppliers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Supplier;

@Repository
public interface SuppliersRepository extends JpaRepository<Suppliers, String> {
//    Suppliers findById(String id);

    @Query("""
    SELECT s FROM Suppliers s
    WHERE s.joinDate BETWEEN :from AND :to
    AND (
        LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(s.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(s.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
""")
    Page<Suppliers> searchWithDateFilter(
            @Param("keyword") String keyword,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);

    @Query("SELECT MIN(s.joinDate) FROM Suppliers s")
    LocalDateTime findEarliestJoinDate();

        boolean existsByPhone(String phone);

    List<Suppliers> findByStatusTrue();}
