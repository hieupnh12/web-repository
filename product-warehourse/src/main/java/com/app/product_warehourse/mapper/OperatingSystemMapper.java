package com.app.product_warehourse.mapper;


import com.app.product_warehourse.dto.request.OperatingSystemRequest;
import com.app.product_warehourse.dto.response.OperatingSystemResponse;
import com.app.product_warehourse.entity.OperatingSystem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OperatingSystemMapper {
    OperatingSystem ToOperatingSystem (OperatingSystemRequest request);
    OperatingSystemResponse toOperatingSystemResponse(OperatingSystem operatingSystem);
}
