package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.RamRequest;
import com.app.product_warehourse.dto.response.RamResponse;
import com.app.product_warehourse.entity.Ram;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RamMapper {
    Ram toRam(RamRequest request);
    RamResponse toRamResponse(Ram ram);
    void updateRamFromRequest(RamRequest request, @MappingTarget Ram ram);
}