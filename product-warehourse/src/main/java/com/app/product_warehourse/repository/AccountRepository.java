package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByUserName(String userName);
    boolean existsByUserName(String userName);
}
