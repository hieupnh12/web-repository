package com.app.product_warehourse.mapper;


import com.app.product_warehourse.dto.request.SupplierRequest;
import com.app.product_warehourse.dto.response.SupplierResponse;
import com.app.product_warehourse.entity.Suppliers;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SupplierMapper {

    Suppliers toSuppliers(SupplierRequest supplierRequest);

    SupplierResponse toSupplierResponse(Suppliers suppliers);

    void updateSupplierFromRequest(SupplierRequest request, @MappingTarget Suppliers suppliers);

}
