package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.AccountCreateRequest;
import com.app.product_warehourse.dto.request.AccountUpdateRequest;
import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.ChangePasswordRequest;
import com.app.product_warehourse.dto.response.AccountResponse;
import com.app.product_warehourse.dto.response.StaffResponse;
import com.app.product_warehourse.dto.response.StaffSelectResponse;
import com.app.product_warehourse.service.AccountService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AccountController {
    AccountService accountService;

    @PostMapping("/{staffId}")
    public ApiResponse<Void> createAccount(@PathVariable String staffId, @Valid  @RequestBody AccountCreateRequest request) {
        accountService.createAccount(request,staffId);
        return ApiResponse.<Void>builder()
                .message("Account created")
                .build();
    }

    @GetMapping
    public ApiResponse<List<AccountResponse>> getAllAccounts() {
        return ApiResponse.<List<AccountResponse>>builder()
                .result(accountService.getAllAccounts())
                .build();
    }
    @PostMapping("/change/{staffId}")
    public ApiResponse<String> changePassword( @PathVariable String staffId,@Valid @RequestBody ChangePasswordRequest request) {
        accountService.changePassword(request,staffId);
        String message = "Password changed successfully";
        return ApiResponse.<String>builder()
                .result(message)
                .build();
    }

    @PutMapping("/update/{staffId}")
    public ApiResponse<AccountResponse> updateAccount(@PathVariable String staffId, @Valid @RequestBody AccountUpdateRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .result(accountService.updateAccount(staffId,request))
                .build();
    }

    @GetMapping("/staff-account")
    public ApiResponse<List<StaffSelectResponse>> getAllStaffNotAccounts() {
        return ApiResponse.<List<StaffSelectResponse>>builder()
                .result(accountService.getStaff())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAccountByStaffId(@PathVariable String id) {
        accountService.deleteAccountByStaffId(id);
        return ApiResponse.<Void>builder()
                .message("Account deleted successfully")
                .build();
    }

}
