package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.response.FunctionResponse;
import com.app.product_warehourse.dto.response.RoleResponse;
import com.app.product_warehourse.service.FunctionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/function")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FunctionController {
    FunctionService functionService;

    @GetMapping
    public ApiResponse<List<FunctionResponse>> getAllFunctions() {
        return ApiResponse.<List<FunctionResponse>>builder()
                .result(functionService.getAllFunctions())
                .build();
    }

    @GetMapping("/functionByRole")
    public ApiResponse<List<FunctionResponse>> getFunctionByRole() {
        return ApiResponse.<List<FunctionResponse>>builder()
                .result(functionService.getFunctionByRole())
                .build();
    }
}
