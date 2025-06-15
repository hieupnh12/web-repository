package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.StaffCreateRequest;
import com.app.product_warehourse.dto.request.StaffUpdateRequest;
import com.app.product_warehourse.dto.response.StaffResponse;
import com.app.product_warehourse.service.StaffService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class StaffController {
    StaffService staffService;
    @PostMapping
    public ApiResponse<StaffResponse> addStaff(@RequestBody StaffCreateRequest request) {
        return ApiResponse.<StaffResponse>builder()
                .result(staffService.createStaff(request))
                .build();
    }
    @DeleteMapping("/{staffId}")
    public ApiResponse<Void> deleteStaff(@PathVariable String staffId) {
        staffService.deleteStaff(staffId);
        return ApiResponse.<Void>builder().build();
    }
    @GetMapping
    public ApiResponse<List<StaffResponse>> getAllStaff() {

        return ApiResponse.<List<StaffResponse>>builder()
                .result(staffService.getAllStaff())
                .build();
    }
    @PutMapping("/{staffId}")
    public ApiResponse<StaffResponse> updateStaff(@PathVariable String staffId, @RequestBody StaffUpdateRequest request) {
        return ApiResponse.<StaffResponse>builder()
                .result(staffService.updateStaff(staffId,request))
                .build();
    }
    @GetMapping("/myInfo")
    public ApiResponse<StaffResponse> getAccount() {
        return ApiResponse.<StaffResponse>builder()
                .result(staffService.getMyInfo())
                .build();
    }
}
