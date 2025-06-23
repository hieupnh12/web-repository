package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ImportReceiptRequest;
import com.app.product_warehourse.dto.response.ImportReceiptResponse;
import com.app.product_warehourse.entity.ImportReceipt;

public interface ImportReceiptDetailsMapper {

    ImportReceipt getImportReceiptDetails(ImportReceiptRequest request);

    ImportReceiptResponse getImportReceiptResponse(ImportReceipt importReceipt);

}
