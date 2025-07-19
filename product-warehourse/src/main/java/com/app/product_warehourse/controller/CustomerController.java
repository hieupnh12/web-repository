package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.CustomerCreateRequest;
import com.app.product_warehourse.dto.request.CustomerUpdateRequest;
import com.app.product_warehourse.dto.response.CustomerResponse;
import com.app.product_warehourse.entity.Customer;
import com.app.product_warehourse.repository.CustomerRepository;
import com.app.product_warehourse.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CustomerController {
    CustomerService customerService;

//    @GetMapping
//    public ApiResponse<List<CustomerResponse>> getAllCustomers() {
//        return ApiResponse.<List<CustomerResponse>>builder()
//                .result(customerService.getAllCustomer())
//                .build();
//    }

    @PostMapping
    public ApiResponse<CustomerResponse> addCustomer(@Valid  @RequestBody CustomerCreateRequest request) {
        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.createCustomer(request))
                .build();
    }

    @PutMapping("/{customerId}")
    public ApiResponse<CustomerResponse> updateCustomer(@PathVariable String customerId, @Valid @RequestBody CustomerUpdateRequest request) {
        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.updateCustomer(customerId,request))
                .build();
    }

    @GetMapping
    public ApiResponse<Page<CustomerResponse>> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10000000000") int size,   HttpServletRequest request) {

        return ApiResponse.<Page<CustomerResponse>>builder()
                .result(customerService.getCustomers(page, size))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<CustomerResponse>> searchCustomers(
            @RequestParam String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ApiResponse.<Page<CustomerResponse>>builder()
                .result(customerService.searchCustomers(keyword, fromDate, toDate, page, size))
                .build();
    }

    @DeleteMapping("/{customerId}")
    public ApiResponse<Void> deleteCustomer(@PathVariable String customerId) {
        customerService.deleteCustomer(customerId);
        return new ApiResponse<>(1005, "Successfully deleted Customer", null);
    }
}
