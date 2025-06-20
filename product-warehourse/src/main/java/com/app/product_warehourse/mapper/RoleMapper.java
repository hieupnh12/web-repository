package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.RoleUpdateRequest;
import com.app.product_warehourse.dto.request.StaffUpdateRequest;
import com.app.product_warehourse.dto.response.RoleResponse;
import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.entity.Staff;
import com.app.product_warehourse.repository.RoleRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {PermissionMapper.class})
public interface RoleMapper {
    RoleResponse toRoleResponse(Role role);

     @Mapping(target = "permissions",  ignore = true)
    RoleResponse toRoleResponseName(Role role);

    void updateRole(@MappingTarget Role role, RoleUpdateRequest request);

}
