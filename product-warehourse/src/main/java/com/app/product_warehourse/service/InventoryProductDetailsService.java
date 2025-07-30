package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ImeiByAreaAndVersionRequest;
import com.app.product_warehourse.dto.request.InventoryProductDetailsRequest;
import com.app.product_warehourse.dto.response.ImeiByAreaAndVersionResponse;
import com.app.product_warehourse.dto.response.InventoryProductDetailsResponse;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.enums.ProductStatus;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.repository.InventoryProductDetailsRepository;
import com.app.product_warehourse.repository.InventoryRepository;
import com.app.product_warehourse.repository.ProductItemRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryProductDetailsService {
    InventoryProductDetailsRepository inventoryProductDetailsRepository;
    InventoryRepository inventoryRepository;
    ProductItemRepository productItemRepository;

    public List<ImeiByAreaAndVersionResponse> getImeiByAreaAndVersion(ImeiByAreaAndVersionRequest request) {
       return inventoryProductDetailsRepository.findImeiByAreaAndVersion(request.getAreaId(), request.getVersionId());
    }

    public List<InventoryProductDetailsResponse> getInventoryProductDetailsByInventoryId(Long inventoryId) {
        Set<InventoryProductDetails> details = inventoryProductDetailsRepository.findByInventoryId(inventoryId);
        return details.stream()
                .map(detail -> InventoryProductDetailsResponse.builder()
                        .inventoryId(detail.getId().getInventoryId())
                        .imei(detail.getId().getImei())
                        .productVersionId(detail.getProductItem().getVersionId().getVersionId())
                        .status(detail.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveInventoryProductDetails(Long inventoryId, List<InventoryProductDetailsRequest> productDetailsRequests) {
        // Verify inventory exists
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_NOT_FOUND));

        // Delete existing product details for this inventory
        inventoryProductDetailsRepository.deleteByInventoryId(inventoryId);

        // Save new product details
        for (InventoryProductDetailsRequest request : productDetailsRequests) {
            ProductItem productItem = productItemRepository.getProductItemByImei(request.getImei())
                    .orElseThrow(() -> new IllegalArgumentException("Product item not found: " + request.getImei()));

            InventoryProductDetails productDetails = InventoryProductDetails.builder()
                    .id(new InventoryProductDetailsId(inventoryId, request.getImei()))
                    .inventory(inventory)
                    .productItem(productItem)
                    .productVersion(productItem.getVersionId())
                    .status(request.getStatus() != null ? request.getStatus() : ProductStatus.NEW)
                    .build();

            inventoryProductDetailsRepository.save(productDetails);
        }
    }

    @Transactional
    public void markMissingIMEI(Long inventoryId, String productVersionId) {
        // This method would mark IMEIs as missing for a specific product version
        // Implementation depends on business logic
        // For now, we'll just log the action
        log.info("Marking IMEI as missing for inventory {} and product version {}", inventoryId, productVersionId);
        
        // You might want to implement specific logic here based on requirements
        // For example, updating status of product items or creating missing records
    }
}
