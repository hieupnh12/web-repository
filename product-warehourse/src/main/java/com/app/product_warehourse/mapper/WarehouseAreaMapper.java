package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.WarehouseAreaRequest;
import com.app.product_warehourse.dto.request.WarehouseUpdateRequest;
import com.app.product_warehourse.dto.response.WarehouseAreaResponse;
import com.app.product_warehourse.entity.WarehouseArea;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WarehouseAreaMapper {
    WarehouseArea toWarehouseArea(WarehouseAreaRequest request);
    WarehouseArea toWarehouseAreaUpdate (WarehouseUpdateRequest request);

    WarehouseAreaResponse toWarehouseAreaResponse(WarehouseArea warehouseArea);
}
