package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.CustomerCreateRequest;
import com.app.product_warehourse.dto.request.CustomerUpdateRequest;
import com.app.product_warehourse.dto.request.StaffUpdateRequest;
import com.app.product_warehourse.dto.response.CustomerResponse;
import com.app.product_warehourse.entity.Customer;
import com.app.product_warehourse.entity.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    Customer toCustomer(CustomerCreateRequest request);
    CustomerResponse toCustomerResponse(Customer customer);
    void updateCustomer(@MappingTarget Customer customer, CustomerUpdateRequest request);

}
