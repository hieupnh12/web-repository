package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.CustomerCreateRequest;
import com.app.product_warehourse.dto.request.CustomerUpdateRequest;
import com.app.product_warehourse.dto.response.CustomerResponse;
import com.app.product_warehourse.entity.Customer;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.CustomerMapper;
import com.app.product_warehourse.repository.CustomerRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CustomerService {
    CustomerRepository customerRepository;
    CustomerMapper customerMapper;

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Customer_CREATE')")
    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        if (customerRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.PHONE_NUMBER_AVAILABLE);
        }

       Customer c = customerMapper.toCustomer(request);
       customerRepository.save(c);
       return customerMapper.toCustomerResponse(c);
    }
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Customer_UPDATE')")
    public CustomerResponse updateCustomer(String customerId, CustomerUpdateRequest request) {
        var customer = customerRepository.findById(customerId).orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXIST));
        customerMapper.updateCustomer(customer,request);
        return customerMapper.toCustomerResponse(customerRepository.save(customer));
    }
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Customer_VIEW')")
    public Page<CustomerResponse> getCustomers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "joinDate"));
        return customerRepository.findAll(pageable)
                .map(customerMapper::toCustomerResponse);
    }

    public Page<CustomerResponse> searchCustomers(
            String keyword,
            LocalDate fromDate,
            LocalDate toDate,
            int page, int size) {

        if (fromDate == null) {
            LocalDateTime earliest = customerRepository.findEarliestJoinDate();
            fromDate = earliest != null ? earliest.toLocalDate() : LocalDate.of(2000, 1, 1);
        }

        if (toDate == null) {
            toDate = LocalDate.now();
        }

        LocalDateTime from = fromDate.atStartOfDay();
        LocalDateTime to = toDate.atTime(LocalTime.MAX);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "joinDate"));

        return customerRepository
                .searchWithDateFilter(keyword, from, to, pageable)
                .map(customerMapper::toCustomerResponse);
    }

    public Customer getCustomer(String customerId) {
        return customerRepository.findById(customerId).orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXIST));
    }



    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Customer_DELETE')")
    public void deleteCustomer(String customerId) {
        customerRepository.deleteById(customerId);
    }
}
