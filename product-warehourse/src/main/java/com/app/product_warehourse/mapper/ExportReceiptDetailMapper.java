package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ExportReceiptDetailUpdateRequest;
import com.app.product_warehourse.dto.request.ExportReceiptDetailsRequest;
import com.app.product_warehourse.dto.response.ExportReceiptDetailsResponse;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.service.ExportReceiptService;
import com.app.product_warehourse.service.ProductItemService;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ExportReceiptDetailMapper {

    @Mapping(target = "export_id", source = "newExId.export_id.export_id")
    @Mapping(target = "productVersionId", source = "newExId.productVersionId.versionId", qualifiedByName = "mapProductVersionToId")
    @Mapping(target = "imei", source = "productItems") // Ánh xạ trực tiếp từ productItems
    ExportReceiptDetailsResponse toExportDetailsResponse(ExportReceiptDetail exportDetail);

    @Mapping(target = "export_id", ignore = true)
    @Mapping(target = "productVersionId", ignore = true)
    ExportReceiptDetail.ExportReceiptDetailId toExportReceiptDetailId(ExportReceiptDetailsRequest request);




    @Mapping(target = "newExId", ignore = true)
    @Mapping(target = "quantity", source = "request.quantity")
    @Mapping(target = "unitPrice", source = "request.unitPrice")
    ExportReceiptDetail toExportDetails(ExportReceiptDetailsRequest request, ProductItem productItem, ExportReceipt exportReceipt);



    void toUpdateExportDetail(ExportReceiptDetailUpdateRequest request, @MappingTarget ExportReceiptDetail exportDetail);

    default ExportReceiptDetail.ExportReceiptDetailId ExportReceiptToConnect(ExportReceiptDetailsRequest request, ProductItem item, ExportReceipt export) {
        ExportReceiptDetail.ExportReceiptDetailId erd = toExportReceiptDetailId(request);
        erd.setExport_id(export);
        erd.setProductVersionId(item);
        return erd;
    }

    @Named("mapProductVersionToId")
    default String mapProductVersionToId(ProductVersion productVersion) {
        return productVersion != null ? productVersion.getVersionId() : null;
    }
}