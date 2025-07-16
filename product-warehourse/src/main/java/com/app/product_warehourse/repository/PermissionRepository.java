package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.PermissionResponse;
import com.app.product_warehourse.dto.response.StaffSelectResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Permission;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    @EntityGraph(attributePaths = {"functions"})
    List<Permission> findAll();

    @Query(value = """
    SELECT s.staff_id,
           s.full_name,
           s.gender,
           s.birth_date,
           s.phone_number,
           s.email
    FROM staff s
    LEFT JOIN account a ON s.staff_id = a.staff_id
    WHERE a.staff_id IS NULL AND s.status = TRUE
    """, nativeQuery = true)
    List<StaffSelectResponse> getStaff();

    @Query(value = """
            select f.function_id, p.can_view, p.can_create, p.can_update, p.can_delete from account a\s
        left join role_permissions rp on a.role_id = rp.role_id
        left join permission p on p.permission_id = rp.permission_id
        left join functions f on f.function_id = p.function_id
        where a.staff_id = ?1 and f.function_id = ?2
        """, nativeQuery = true)
    List<PermissionResponse> getPermissionsByFunctionId(String staff_id, Long function_id);
}
