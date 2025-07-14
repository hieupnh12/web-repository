package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ProductItemRequest;
import com.app.product_warehourse.dto.response.ProductItemResponse;
import com.app.product_warehourse.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProductItemMapper {
    ProductItem toProductItem(ProductItemRequest request);

    @Mapping(source = "versionId.versionId", target = "productVersionId" , nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "import_id.import_id", target = "importId" , nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "export_id.export_id", target = "exportId" , nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    ProductItemResponse toProductItemResponse(ProductItem productItem);

    default ProductItem ToProducItemcreate(ProductItemRequest request, ProductVersion version, ImportReceipt imports, ExportReceipt exports) {
        ProductItem item = toProductItem(request);
        item.setVersionId(version);
        item.setImport_id(imports);
        item.setExport_id(exports);
        return item;
    }

    void toUpdateProductItem(ProductItemRequest request,@MappingTarget ProductItem productItem);


}