package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ImportReceiptDetailsRequest;
import com.app.product_warehourse.dto.request.ImportReceiptDetailsUpdateRequest;
import com.app.product_warehourse.dto.response.ImportReceiptDetailsResponse;
import com.app.product_warehourse.entity.ImportReceipt;
import com.app.product_warehourse.entity.ImportReceiptDetail;
import com.app.product_warehourse.entity.ProductVersion;
import com.app.product_warehourse.service.ImportReceiptService;
import com.app.product_warehourse.service.ProductVersionService;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface ImportReceiptDetailsMapper {

    @Mapping(target = "id", ignore = true) // Bỏ qua ánh xạ id
    @Mapping(target = "productVersionId", ignore = true) // Bỏ qua ánh xạ productVersionId
    ImportReceiptDetail.ImportReceiptDetailId toImportIDDetails(ImportReceiptDetailsRequest request);


    @Mapping(target = "id", source = "newid.id.import_id") // Ánh xạ import_id của ImportReceipt
    @Mapping(target = "productVersionId", source = "newid.productVersionId.versionId") // Ánh xạ versionId của ProductVersion
    ImportReceiptDetailsResponse toImportReceiptDetailsResponse (ImportReceiptDetail importReceiptDetail);



    default ImportReceipt mapStringToImportReceipt(String id, @Context ImportReceiptService service) {
        return service.getImportReceipt(id);
    }

    default ProductVersion mapStringToProductVersion(String id, @Context ProductVersionService service) {
        return service.GetProductVersionById(id);
    }

    @Mapping(target = "newid.id", source = "id")
    @Mapping(target = "newid.productVersionId", source = "productVersionId")
    ImportReceiptDetail toImportReceiptDetails(ImportReceiptDetailsRequest request, @Context ImportReceiptService importService, @Context ProductVersionService productVersionService);



//    ImportReceiptDetail toUpdateImportDetail(ImportReceiptDetailsUpdateRequest request);
       void toUpdateImportDetail(ImportReceiptDetailsUpdateRequest request, @MappingTarget ImportReceiptDetail importReceiptDetail);


    default ImportReceiptDetail.ImportReceiptDetailId getInforImportReceiptDetails(ImportReceiptDetailsRequest request, ImportReceipt im , ProductVersion version){
        ImportReceiptDetail.ImportReceiptDetailId ird = toImportIDDetails(request);
        ird.setId(im);
        ird.setProductVersionId(version);
        return ird;
    }

}
