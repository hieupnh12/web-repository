package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.response.RoleResponse;
import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.repository.RoleRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleResponse toRoleResponse(Role role);

     @Mapping(target = "permissions",  ignore = true)
    RoleResponse toRoleResponseName(Role role);


}
