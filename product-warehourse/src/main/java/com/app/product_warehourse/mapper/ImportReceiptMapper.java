package com.app.product_warehourse.mapper;


import com.app.product_warehourse.dto.request.ImportReceiptRequest;
import com.app.product_warehourse.dto.response.ImportReceiptFULLResponse;
import com.app.product_warehourse.dto.response.ImportReceiptResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.ImportReceipt;
import com.app.product_warehourse.entity.Staff;
import com.app.product_warehourse.entity.Suppliers;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ImportReceiptDetailsMapper.class})
public interface ImportReceiptMapper {

    @Mapping(target ="time" ,ignore = true)
    ImportReceipt  toImportReceipt(ImportReceiptRequest request);


    @Mapping(source ="suppliers.name" ,target ="supplierName")
    @Mapping(source ="staff.userName" ,target ="staffName")
    ImportReceiptResponse toImportReceiptResponse(ImportReceipt imports);


    default ImportReceipt ImportReceiptMake (ImportReceiptRequest request, Suppliers suppliers, Account account) {
         ImportReceipt importReceipt = toImportReceipt(request);
         importReceipt.setStaff(account);
         importReceipt.setSuppliers(suppliers);
         return importReceipt;
    }


    @Mapping(source ="suppliers.name" ,target ="supplierName")
    @Mapping(source ="staff.userName" ,target ="staffName")
    @Mapping(source = "importReceiptDetails", target = "details") // Sửa từ "Product" thành "importReceiptDetails"
    ImportReceiptFULLResponse toImportReceiptFULLResponse(ImportReceipt imports);


}
