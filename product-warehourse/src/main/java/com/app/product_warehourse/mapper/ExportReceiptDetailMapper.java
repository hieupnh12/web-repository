package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ExportReceiptDetailUpdateRequest;
import com.app.product_warehourse.dto.request.ExportReceiptDetailsRequest;
import com.app.product_warehourse.dto.response.ExportReceiptDetailsResponse;
import com.app.product_warehourse.dto.response.ImeiResponse;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.service.ExportReceiptService;
import com.app.product_warehourse.service.ProductItemService;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {ProductVersionMapper.class})
public interface ExportReceiptDetailMapper {

//    @Mapping(target = "productVersionId", source = "newExId.productVersionId.imei", qualifiedByName = "mapProductVersionToId")

    @Mapping(target = "export_id", source = "newExId.export_id.export_id")
    @Mapping(target = "productVersionId", source = "newExId.productVersionId.versionId", qualifiedByName = "mapProductVersionToId")
    @Mapping(target = "productVersion", source = "newid.productVersionId") // Ánh xạ trực tiếp từ productItems
    ExportReceiptDetailsResponse toExportDetailsResponse(ExportReceiptDetail exportDetail);

    @Mapping(target = "export_id", ignore = true)
    @Mapping(target = "productVersionId", ignore = true)
    ExportReceiptDetail.ExportReceiptDetailId toExportReceiptDetailId(ExportReceiptDetailsRequest request);




    @Mapping(target = "newExId", ignore = true)
    @Mapping(target = "quantity", source = "request.quantity")
    @Mapping(target = "unitPrice", source = "request.unitPrice")
//    @Mapping(target = "productItems", source = "imei")
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


    @Named("mapProductItemsToImeiResponse")
    default List<ImeiResponse> mapProductItemsToImeiResponse(List<ProductItem> productItems) {
        if (productItems == null) {
            return null;
        }
        return productItems.stream()
                .map(item -> ImeiResponse.builder().imei(item.getImei()).build())
                .collect(Collectors.toList());
    }
}