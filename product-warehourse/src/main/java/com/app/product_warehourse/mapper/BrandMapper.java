package com.app.product_warehourse.mapper;


import com.app.product_warehourse.dto.request.BrandRequest;
import com.app.product_warehourse.dto.response.BrandResponse;
import com.app.product_warehourse.entity.Brand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper {
      Brand toBrand(BrandRequest request);
      BrandResponse toBrandResponse(Brand brand);
}
