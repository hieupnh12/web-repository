package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductTestMapper {

    @Mapping(source = "origin.name", target = "originName")
    @Mapping(source = "operatingSystem.name", target = "operatingSystemName")
    @Mapping(source = "brand.brandName", target = "brandName")
    @Mapping(source = "warehouseArea.name", target = "warehouseAreaName")
    ProductResponse toProductResponse (Product product);

}
