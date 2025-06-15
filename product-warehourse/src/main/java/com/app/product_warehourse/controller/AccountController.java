package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.AccountCreateRequest;
import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.ChangePasswordRequest;
import com.app.product_warehourse.dto.response.AccountResponse;
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
    public ApiResponse<AccountResponse> createAccount(@Valid  @PathVariable String staffId, @RequestBody AccountCreateRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .result(accountService.createAccount(request,staffId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<AccountResponse>> getAllAccounts() {
        return ApiResponse.<List<AccountResponse>>builder()
                .result(accountService.getAllAccounts())
                .build();
    }
    @PostMapping("/change/{staffId}")
    public ApiResponse<String> changePassword(@Valid @PathVariable String staffId, @RequestBody ChangePasswordRequest request) {
        accountService.changePassword(request,staffId);
        String message = "Password changed successfully";
        return ApiResponse.<String>builder()
                .result(message)
                .build();
    }



}
