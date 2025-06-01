package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.AccountCreateRequest;
import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.response.AccountResponse;
import com.app.product_warehourse.service.AccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AccountController {
    AccountService accountService;

    @PostMapping("/{staffId}")
    public ApiResponse<AccountResponse> createAccount(@PathVariable String staffId,  @RequestBody AccountCreateRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .result(accountService.createAccount(request,staffId))
                .build();
    }


}
