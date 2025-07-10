package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.RoleCreateRequest;
import com.app.product_warehourse.dto.request.RoleUpdateRequest;
import com.app.product_warehourse.dto.response.RoleResponse;
import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleController {
    RoleService roleService;

    @PostMapping
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleCreateRequest request) {
      return ApiResponse.<RoleResponse>builder()
              .result(roleService.createRole(request))
              .build();
    }

    @GetMapping("/myRole")
    public ApiResponse<RoleResponse> getRoleName() {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.getRoleName())
                .build();
    }
    @GetMapping
    public ApiResponse<List<RoleResponse>> getAllRoles() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .build();
    }
    @DeleteMapping("/{roleId}")
    public ApiResponse<Void> deleteRole(@PathVariable long roleId) {
      roleService.deleteRoleById(roleId);
        return ApiResponse.<Void>builder()
                .message("Role deleted")
                .build();
    }


    @GetMapping("/details/{roleId}")
    public ApiResponse<RoleResponse> getRoleById(@PathVariable Long roleId) {
      return ApiResponse.<RoleResponse>builder()
              .result(roleService.getRoleById(roleId))
              .build();
    }

    @PutMapping("/update/{roleId}")
    public ApiResponse<RoleResponse> updateRole(@PathVariable Long roleId, @RequestBody RoleUpdateRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.updateRole(roleId,request))
                .build();

    }
}
