package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.RoleCreateRequest;
import com.app.product_warehourse.dto.response.RoleResponse;
import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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
    @PostMapping("/{roleId}")
    public ApiResponse<Void> deleteRole(@PathVariable long roleId) {
      roleService.deleteRoleById(roleId);
        return ApiResponse.<Void>builder().build();
    }
}
