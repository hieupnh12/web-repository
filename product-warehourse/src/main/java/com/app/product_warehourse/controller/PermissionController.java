package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.PermissionRequest;
import com.app.product_warehourse.dto.response.PermissionResponse;
import com.app.product_warehourse.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permission")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    public ApiResponse<PermissionResponse> function(@RequestBody PermissionRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.createPermission(request))
                .build();

    }

    @GetMapping
    public ApiResponse<List<PermissionResponse>> getAllPermission() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAllPermissions())
                .build();
    }
}
