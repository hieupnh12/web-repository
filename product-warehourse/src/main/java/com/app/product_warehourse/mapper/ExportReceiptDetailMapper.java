package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ExportReceiptDetailUpdateRequest;
import com.app.product_warehourse.dto.request.ExportReceiptDetailsRequest;
import com.app.product_warehourse.dto.response.ExportReceiptDetailsResponse;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.service.ExportReceiptService;
import com.app.product_warehourse.service.ProductItemService;
import com.app.product_warehourse.service.ProductVersionService;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ExportReceiptDetailMapper {

    @Mapping(target = "export_id", source = "newExId.export_id.export_id")
    @Mapping(target = "imei", source = "newExId.item_id.imei")
    ExportReceiptDetailsResponse toExportDetailsResponse(ExportReceiptDetail exportDetail);

    @Mapping(target = "export_id", ignore = true)
    @Mapping(target = "item_id", ignore = true)
    ExportReceiptDetail.ExportReceiptDetailId toExportReceiptDetailId(ExportReceiptDetailsRequest request);



    default ExportReceipt mapStringToExportReceipt(String id, @Context ExportReceiptService service) {
        return service.getExportreceipt(id);
    }

    default ProductItem mapStringToProductItem(Long id, @Context ProductItemService service) {
        return service.getProductItemByid(id);
    }

    @Mapping(target = "newExId.export_id", source = "export_id")
    @Mapping(target = "newExId.item_id", source = "item_id")
    ExportReceiptDetail toExportDetails(ExportReceiptDetailsRequest request, @Context ProductItemService productItemService, @Context ExportReceiptService exportReceiptService);

    void toUpdateExportDetail(ExportReceiptDetailUpdateRequest request, @MappingTarget ExportReceiptDetail exportDetail);

    default ExportReceiptDetail.ExportReceiptDetailId ExportReceiptToConnect(ExportReceiptDetailsRequest request, ProductItem item, ExportReceipt export) {
        ExportReceiptDetail.ExportReceiptDetailId erd = toExportReceiptDetailId(request);
        erd.setExport_id(export);
        erd.setItem_id(item);
        return erd;
    }


}