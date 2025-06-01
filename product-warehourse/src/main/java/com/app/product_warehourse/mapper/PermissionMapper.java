package com.app.product_warehourse.mapper;


import com.app.product_warehourse.dto.request.PermissionRequest;
import com.app.product_warehourse.dto.response.PermissionResponse;

import com.app.product_warehourse.entity.Functions;
import com.app.product_warehourse.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    //@Mapping(target = "functions", source = "functionId")
    @Mapping(target = "permissionId", ignore = true)
    Permission toPermission(PermissionRequest request, Functions functions);

    PermissionResponse toPermissionResponse(Permission request, Long functionId);

}
