package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Permission;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    @EntityGraph(attributePaths = {"functions"})
    List<Permission> findAll();

}
