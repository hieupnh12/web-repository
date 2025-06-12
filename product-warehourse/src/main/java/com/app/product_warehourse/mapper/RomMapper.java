package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.RomRequest;
import com.app.product_warehourse.dto.response.RomResponse;
import com.app.product_warehourse.entity.Rom;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RomMapper {
    Rom toRom(RomRequest request);
    RomResponse toRomResponse(Rom rom);
    void updateRomFromRequest(RomRequest request, @MappingTarget Rom rom);
}