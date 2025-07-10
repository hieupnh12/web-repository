package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ProductItemRequest;
import com.app.product_warehourse.dto.response.ProductItemResponse;
import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.entity.ImportReceipt;
import com.app.product_warehourse.entity.ProductItem;
import com.app.product_warehourse.entity.ProductVersion;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.ProductItemMapper;
import com.app.product_warehourse.repository.ExportReceiptRepository;
import com.app.product_warehourse.repository.ImportReceiptRepository;
import com.app.product_warehourse.repository.ProductItemRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductItemService {
    ProductItemRepository productItemRepo;
    ProductItemMapper productItemMapper;

    ProductVersionService versionService;

    ExportReceiptRepository exportReceiptRepo;

    ImportReceiptRepository importReceiptRepo; // Thay thế ImportReceiptService

//    public ProductItem createProductItem(ProductItemRequest request) {
//        ProductVersion version = versionService.GetProductVersionById(request.getProductVersionId());
//        ImportReceipt imports = importReceiptService.getImportReceipt(request.getImportId());
//        ExportReceipt exports = request.getExportId() != null
//                ? exportReceiptService.getExportreceipt(request.getExportId())
//                : null;
//
//        ProductItem productItem = productItemMapper.ToProducItemcreate(request, version, imports, exports);
//        return productItemRepo.save(productItem);
//    }


    public ProductItem createProductItem(ProductItemRequest request) {
        ProductVersion version = versionService.GetProductVersionById(request.getProductVersionId());
        ImportReceipt imports = importReceiptRepo.findById(request.getImportId())
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));
        ExportReceipt exports = request.getExportId() != null
                ? exportReceiptRepo.findById(request.getExportId()).orElseThrow(() -> new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND))
                : null;

        ProductItem productItem = productItemMapper.ToProducItemcreate(request, version, imports, exports);
        return productItemRepo.save(productItem);
    }








    public List<ProductItemResponse> getAllProductItems() {
        List<ProductItem> productItems = productItemRepo.findAll();
        return productItems.stream()
                .map(productItemMapper::toProductItemResponse)
                .collect(Collectors.toList());
    }




    public ProductItemResponse getProductItemByid(String imei) {
        var productItem = productItemRepo.getProductItemByImei(imei)
                .orElseThrow(() -> new RuntimeException("ProductItem not found"));
        return productItemMapper.toProductItemResponse(productItem);
    }






    public void deleteProductItemById(String id) {
        productItemRepo.deleteById(id);
    }

    public ProductItemResponse updateProductItem(String imei, ProductItemRequest request) {
        ProductItem productItem = productItemRepo.findById(imei)
                .orElseThrow(() -> new RuntimeException("ProductItem not found"));

        ProductVersion version = versionService.GetProductVersionById(request.getProductVersionId());
        ImportReceipt imports = importReceiptRepo.findById(request.getImportId())
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));
        ExportReceipt exports = request.getExportId() != null
                ? exportReceiptRepo.findById(request.getExportId()).orElseThrow(() -> new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND))
                : null;

        productItem.setVersionId(version);
        productItem.setImport_id(imports);
        productItem.setExport_id(exports);
        productItem.setStatus(request.isStatus());

        return productItemMapper.toProductItemResponse(productItemRepo.save(productItem));
    }



    // Updated method to return list of imei by productVersionId
//    public List<String> getProductItemByProductVersionId(String productVersionId) {
//        // Fetch the list of IMEIs
//        List<String> imeis = productItemRepo.findImeiByProductVersionId(productVersionId);
//
//        // Check if the result is empty
//        if (imeis.isEmpty()) {
//            throw new RuntimeException("No IMEIs found for product version ID " + productVersionId);
//        }
//
//        return imeis;
//    }

}