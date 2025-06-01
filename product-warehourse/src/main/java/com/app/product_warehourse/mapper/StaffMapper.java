package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.StaffRequest;
import com.app.product_warehourse.dto.response.StaffResponse;
import com.app.product_warehourse.entity.Staff;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StaffMapper {
    Staff toStaff (StaffRequest request);
    StaffResponse toStaffResponse (Staff staff);
}
