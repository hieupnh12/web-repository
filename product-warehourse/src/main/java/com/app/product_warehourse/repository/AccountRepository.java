package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Account;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    @EntityGraph(attributePaths = {"role"})
    Optional<Account> findByUserName(String userName);
    boolean existsByUserName(String userName);


    @EntityGraph(attributePaths = {"role"})
    List<Account> findAll();

    boolean existsByStaffId(String staffId);


}
