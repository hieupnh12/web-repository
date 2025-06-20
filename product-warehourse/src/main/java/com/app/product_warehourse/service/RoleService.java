package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.PermissionRequest;
import com.app.product_warehourse.dto.request.RoleCreateRequest;
import com.app.product_warehourse.dto.request.RoleUpdateRequest;
import com.app.product_warehourse.dto.response.RoleResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Functions;
import com.app.product_warehourse.entity.Permission;
import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.RoleMapper;
import com.app.product_warehourse.mapper.StaffMapper;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.FunctionRepository;
import com.app.product_warehourse.repository.PermissionRepository;
import com.app.product_warehourse.repository.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    FunctionRepository functionRepository;
    RoleMapper roleMapper;
    AccountRepository accountRepository;
    private final StaffMapper staffMapper;

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public RoleResponse createRole(RoleCreateRequest request) {
        if (roleRepository.existsByRoleName(request.getRoleName())) {
            throw new AppException(ErrorCode.ROLE_EXITED);
        }
        Set<Permission> permissions = new HashSet<>();
        Functions function = null;
        for (PermissionRequest permDTO : request.getPermissions()) {
            // Tra cứu Function
            function = functionRepository.findById(permDTO.getFunctionId())
                    .orElseThrow(() -> new RuntimeException("Function not found with id: " + permDTO.getFunctionId()));

            // Tạo Permission
            Permission permission = Permission.builder()
                    .functions(function)
                    .canView(permDTO.isCanView())
                    .canCreate(permDTO.isCanCreate())
                    .canUpdate(permDTO.isCanUpdate())
                    .canDelete(permDTO.isCanDelete())
                    .build();

            permissions.add(permission);
        }

        // 2. Lưu tất cả Permission
        permissions = new HashSet<>(permissionRepository.saveAll(permissions));

        // 3. Tạo Role và gán danh sách Permission
        Role role = Role.builder()
                .roleName(request.getRoleName())
                .description(request.getDescription())
                .permissions(permissions)
                .build();

        var s = roleRepository.save(role);
        return roleMapper.toRoleResponse(s);
    }
    @Transactional
    public RoleResponse updateRole(Long roleId, RoleUpdateRequest request) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXIT));

        // 1. Cập nhật tên và mô tả
        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());

        // 2. Xử lý Permission mới
        Set<Permission> newPermissions = request.getPermissions().stream()
                .map(p -> {
                    Functions function = functionRepository.findById(p.getFunctionId())
                            .orElseThrow(() -> new AppException(ErrorCode.FUNCTION_NOT_EXIST));

                    return Permission.builder()
                            .functions(function)
                            .canView(p.isCanView())
                            .canCreate(p.isCanCreate())
                            .canUpdate(p.isCanUpdate())
                            .canDelete(p.isCanDelete())
                            .build();
                })
                .collect(Collectors.toSet());

        // 3. Save Permission trước
        newPermissions = new HashSet<>(permissionRepository.saveAll(newPermissions));

        // 4. Gán vào Role
        role.setPermissions(newPermissions);

        // 5. Lưu lại Role và trả response
        Role saved = roleRepository.save(role);
        return roleMapper.toRoleResponse(saved);
    }


    @PreAuthorize("hasRole('ADMIN')")
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toRoleResponseName)
                .collect(Collectors.toList());

    }

    public RoleResponse getRoleName() {
        var context =  SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account  =  accountRepository.findByUserName(name).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        var role = roleRepository.findById(account.getRole().getRoleId()).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        return roleMapper.toRoleResponseName(role);

    }
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteRoleById(Long roleId) {
        roleRepository.deleteById(roleId);
    }

    public RoleResponse getRoleById(Long roleId) {
        var role = roleRepository.findById(roleId).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXIT));
        return roleMapper.toRoleResponse(role);
    }


}
