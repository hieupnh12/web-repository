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
import org.springframework.stereotype.Service;

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

    public CustomerResponse createCustomer(CustomerCreateRequest request) {
       Customer c = customerMapper.toCustomer(request);
       customerRepository.save(c);
       return customerMapper.toCustomerResponse(c);
    }

    public CustomerResponse updateCustomer(String customerId, CustomerUpdateRequest request) {
        var customer = customerRepository.findById(customerId).orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXIST));
        customerMapper.updateCustomer(customer,request);
        return customerMapper.toCustomerResponse(customerRepository.save(customer));
    }

    public Customer getCustomer(String customerId) {
        return customerRepository.findById(customerId).orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXIST));
    }


    public List<CustomerResponse>  getAllCustomer() {
        List<CustomerResponse> customerResponseList = customerRepository.findAll().stream().map(customerMapper::toCustomerResponse).collect(Collectors.toList());
        return customerResponseList;
    }
}
