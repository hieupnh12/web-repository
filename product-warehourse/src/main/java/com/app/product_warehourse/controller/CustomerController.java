package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.CustomerCreateRequest;
import com.app.product_warehourse.dto.request.CustomerUpdateRequest;
import com.app.product_warehourse.dto.response.CustomerResponse;
import com.app.product_warehourse.entity.Customer;
import com.app.product_warehourse.repository.CustomerRepository;
import com.app.product_warehourse.service.CustomerService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CustomerController {
    CustomerService customerService;

    @GetMapping
    public ApiResponse<List<CustomerResponse>> getAllCustomers() {
        return ApiResponse.<List<CustomerResponse>>builder()
                .result(customerService.getAllCustomer())
                .build();
    }

    @PostMapping
    public ApiResponse<CustomerResponse> addCustomer(@Valid  @RequestBody CustomerCreateRequest request) {
        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.createCustomer(request))
                .build();
    }

    @PutMapping("/{customerId}")
    public ApiResponse<CustomerResponse> updateCustomer(@Valid @PathVariable String customerId, @RequestBody CustomerUpdateRequest request) {
        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.updateCustomer(customerId,request))
                .build();
    }
}
