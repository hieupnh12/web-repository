package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.RoleCreateRequest;
import com.app.product_warehourse.dto.response.RoleResponse;
import com.app.product_warehourse.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
