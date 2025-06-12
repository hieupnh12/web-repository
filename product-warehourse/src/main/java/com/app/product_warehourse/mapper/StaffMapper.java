package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.StaffCreateRequest;
import com.app.product_warehourse.dto.request.StaffUpdateRequest;
import com.app.product_warehourse.dto.response.StaffResponse;
import com.app.product_warehourse.entity.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StaffMapper {
    Staff toStaff (StaffCreateRequest request);
    StaffResponse toStaffResponse (Staff staff);

    void updateStaff(@MappingTarget Staff staff, StaffUpdateRequest request);
}
