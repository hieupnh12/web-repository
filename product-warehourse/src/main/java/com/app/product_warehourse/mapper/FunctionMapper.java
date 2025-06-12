package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.response.FunctionResponse;
import com.app.product_warehourse.entity.Functions;
import org.mapstruct.Mapper;

import java.util.function.Function;

@Mapper(componentModel = "spring")
public interface FunctionMapper {
    FunctionResponse toFunctionResponse(Functions functions);
}
