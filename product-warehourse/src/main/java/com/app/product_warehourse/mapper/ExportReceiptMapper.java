package com.app.product_warehourse.mapper;


import com.app.product_warehourse.dto.request.ExportReceiptRequest;
import com.app.product_warehourse.dto.response.ExportReceiptFULLResponse;
import com.app.product_warehourse.dto.response.ExportReceiptResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Customer;
import com.app.product_warehourse.entity.ExportReceipt;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ExportReceiptDetailMapper.class})
public interface ExportReceiptMapper {

    ExportReceipt toexportreceipt(ExportReceiptRequest request);


    @Mapping(source = "staff.userName",target = "staffName")
    @Mapping(source = "customer.customerName",target = "customerName")
    ExportReceiptResponse toexportreceiptResponse(ExportReceipt exportReceipt);


    default ExportReceipt  toExportReceiptToconnect(ExportReceiptRequest request, Account account, Customer customer) {
        ExportReceipt exportReceipt = toexportreceipt(request);
        exportReceipt.setCustomer(customer);
        exportReceipt.setStaff(account);
        return exportReceipt;
    }


    @Mapping(source = "staff.userName",target = "staffName")
    @Mapping(source = "customer.customerName",target = "customerName")
    @Mapping(source = "exportReceiptDetails", target = "details") // Sửa từ "Product" thành "importReceiptDetails"
    ExportReceiptFULLResponse toExportreceiptFULLResponse(ExportReceipt exportReceipt);
}
