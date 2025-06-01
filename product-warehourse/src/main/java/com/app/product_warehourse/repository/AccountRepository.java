package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {
}
