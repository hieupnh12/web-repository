package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.OriginRequest;
import com.app.product_warehourse.dto.response.OriginResponse;
import com.app.product_warehourse.entity.Origin;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OriginMapper {
    Origin toOrigin(OriginRequest request);
    OriginResponse toOriginResponse(Origin origin);
}
