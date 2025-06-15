package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ColorRequest;
import com.app.product_warehourse.dto.response.ColorResponse;
import com.app.product_warehourse.entity.Color;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ColorMapper {
    Color toColor(ColorRequest request);
    ColorResponse toColorResponse(Color color);
    void updateColorFromRequest(ColorRequest request, @MappingTarget Color color);
}