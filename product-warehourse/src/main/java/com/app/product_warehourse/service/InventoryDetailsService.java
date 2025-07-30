package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.InventoryDetailsRequest;
import com.app.product_warehourse.dto.response.ReportInventoryDetailsResponse;
import com.app.product_warehourse.entity.Inventory;
import com.app.product_warehourse.entity.InventoryDetails;
import com.app.product_warehourse.entity.InventoryDetailsId;
import com.app.product_warehourse.entity.ProductVersion;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.repository.InventoryDetailsRepository;
import com.app.product_warehourse.repository.InventoryRepository;
import com.app.product_warehourse.repository.ProductVersionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryDetailsService {
    InventoryDetailsRepository inventoryDetailsRepository;
    InventoryRepository inventoryRepository;
    ProductVersionRepository productVersionRepository;

    public List<ReportInventoryDetailsResponse> getReportInventoryDetails(Long productId) {
      return inventoryDetailsRepository.getReportInventoryDetailsByInventoryId(productId);
    }

    @Transactional
    public void saveInventoryDetails(Long inventoryId, List<InventoryDetailsRequest> detailsRequests) {
        // Verify inventory exists
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_NOT_FOUND));

        // Delete existing details for this inventory
        inventoryDetailsRepository.deleteByInventoryId(inventoryId);

        // Save new details
        for (InventoryDetailsRequest request : detailsRequests) {
            ProductVersion productVersion = productVersionRepository.getProductVersionById(request.getProductVersionId())
                    .orElseThrow(() -> new IllegalArgumentException("Product version not found: " + request.getProductVersionId()));

            InventoryDetails details = InventoryDetails.builder()
                    .id(new InventoryDetailsId(inventoryId, request.getProductVersionId()))
                    .inventory(inventory)
                    .productVersion(productVersion)
                    .systemQuantity(request.getSystemQuantity())
                    .quantity(request.getQuantity())
                    .note(request.getNote() != null ? request.getNote() : "")
                    .build();

            inventoryDetailsRepository.save(details);
        }
    }
}
