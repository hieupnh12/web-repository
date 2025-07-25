package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    long countByStatus(Boolean status);
    Page<Customer> findByCustomerNameContainingIgnoreCaseOrAddressContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String name, String email, String phone, Pageable pageable);
    boolean existsByPhone(String phone);

    @Query("""
    SELECT c FROM Customer c 
    WHERE c.joinDate BETWEEN :from AND :to
    AND (
        LOWER(c.customerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(c.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(c.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
""")
    Page<Customer> searchWithDateFilter(
            @Param("keyword") String keyword,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);

    @Query("SELECT MIN(c.joinDate) FROM Customer c")
    LocalDateTime findEarliestJoinDate();



    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = true")
    Long countActiveCustomers();

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = true AND DATE(c.joinDate) = :date")
    Long countNewCustomersByDate(LocalDate date);

    @Query("SELECT COUNT(c) FROM Customer c WHERE c.status = true AND DATE(c.joinDate) <= :date")
    Long countCustomersUpToDate(LocalDate date);

}
