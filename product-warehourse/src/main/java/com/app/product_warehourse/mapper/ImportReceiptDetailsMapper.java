package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ImportReceiptDetailsRequest;
import com.app.product_warehourse.dto.request.ImportReceiptDetailsUpdateRequest;
import com.app.product_warehourse.dto.response.DetailsResponse;
import com.app.product_warehourse.dto.response.ImportReceiptDetailsResponse;
import com.app.product_warehourse.entity.ImportReceipt;
import com.app.product_warehourse.entity.ImportReceiptDetail;
import com.app.product_warehourse.entity.ProductVersion;
import com.app.product_warehourse.repository.ImportReceiptRepository;
import com.app.product_warehourse.repository.ProductVersionRepository;
import com.app.product_warehourse.service.ImportReceiptService;
import com.app.product_warehourse.service.ProductVersionService;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface ImportReceiptDetailsMapper {

    @Mapping(target = "import_id", ignore = true) // Bỏ qua ánh xạ id
    @Mapping(target = "productVersionId", ignore = true) // Bỏ qua ánh xạ productVersionId
    ImportReceiptDetail.ImportReceiptDetailId toImportIDDetails(ImportReceiptDetailsRequest request);


    @Mapping(target = "import_id", source = "newid.import_id.import_id") // Ánh xạ import_id của ImportReceipt
    @Mapping(target = "productVersionId", source = "newid.productVersionId.versionId") // Ánh xạ versionId của ProductVersion
    @Mapping(target = "imei", source = "productItems") // Ánh xạ trực tiếp từ productItems
    ImportReceiptDetailsResponse toImportReceiptDetailsResponse (ImportReceiptDetail importReceiptDetail);

    @Mapping(target = "productVersionId", source = "newid.productVersionId.versionId") // Ánh xạ versionId của ProductVersion
    @Mapping(target = "imei", source = "productItems") // Ánh xạ trực tiếp từ productItems
    DetailsResponse toImportReceiptDetailsResponse2 (ImportReceiptDetail importReceiptDetail);



    @Mapping(target = "newid", ignore = true)
    @Mapping(target = "quantity", source = "request.quantity")
    @Mapping(target = "unitPrice", source = "request.unitPrice")
    ImportReceiptDetail toImportReceiptDetails(ImportReceiptDetailsRequest request, ImportReceipt importReceipt, ProductVersion productVersion);

//    default ImportReceiptDetail toImportReceiptDetailsWithId(ImportReceiptDetailsRequest request, ImportReceipt importReceipt, ProductVersion productVersion) {
//        ImportReceiptDetail detail = toImportReceiptDetails(request, importReceipt, productVersion);
//        ImportReceiptDetail.ImportReceiptDetailId newid = new ImportReceiptDetail.ImportReceiptDetailId(importReceipt, productVersion);
//        detail.setNewid(newid);
//        return detail;
//    }



//    ImportReceiptDetail toUpdateImportDetail(ImportReceiptDetailsUpdateRequest request);
       void toUpdateImportDetail(ImportReceiptDetailsUpdateRequest request, @MappingTarget ImportReceiptDetail importReceiptDetail);


    default ImportReceiptDetail.ImportReceiptDetailId getInforImportReceiptDetails(ImportReceiptDetailsRequest request, ImportReceipt im , ProductVersion version){
        ImportReceiptDetail.ImportReceiptDetailId ird = toImportIDDetails(request);
        ird.setImport_id(im);
        ird.setProductVersionId(version);
        return ird;
    }

}
