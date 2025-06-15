package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.FunctionResponse;
import com.app.product_warehourse.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String roleName);
    Boolean existsByRoleName(String roleName);

    @Query("SELECT new com.app.product_warehourse.dto.response.FunctionResponse(f.functionId, f.functionName) " +
            "FROM Role r " +
            "JOIN r.permissions p " +
            "JOIN p.functions f " +
            "WHERE r.roleId = :roleId")
    List<FunctionResponse> findFunctionResponsesByRoleId(@Param("roleId") Long roleId);
}
