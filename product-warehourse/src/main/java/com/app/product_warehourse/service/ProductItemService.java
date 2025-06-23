package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ProductItemRequest;
import com.app.product_warehourse.dto.response.ProductItemResponse;
import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.entity.ImportReceipt;
import com.app.product_warehourse.entity.ProductItem;
import com.app.product_warehourse.entity.ProductVersion;
import com.app.product_warehourse.mapper.ProductItemMapper;
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
    ImportReceiptService importReceiptService;
    ExportReceiptService exportReceiptService;

    public ProductItem createProductItem(ProductItemRequest request) {
        ProductVersion version = versionService.GetProductVersionById(request.getProductVersionId());
        ImportReceipt imports = importReceiptService.getImportReceipt(request.getImportId());
        ExportReceipt exports = request.getExportId() != null
                ? exportReceiptService.getExportreceipt(request.getExportId())
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

    public ProductItem getProductItemByid(Long id) {
        return productItemRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("ProductItem not found"));
    }

    public void deleteProductItemById(Long id) {
        productItemRepo.deleteById(id);
    }

    public ProductItemResponse updateProductItem(Long id, ProductItemRequest request) {
        ProductItem productItem = productItemRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("ProductItem not found"));

        ProductVersion version = versionService.GetProductVersionById(request.getProductVersionId());
        ImportReceipt imports = importReceiptService.getImportReceipt(request.getImportId());
        ExportReceipt exports = request.getExportId() != null
                ? exportReceiptService.getExportreceipt(request.getExportId())
                : null;

        productItem.setVersionId(version);
        productItem.setImport_id(imports);
        productItem.setExport_id(exports);
        productItem.setStatus(request.isStatus());

        return productItemMapper.toProductItemResponse(productItemRepo.save(productItem));
    }
}