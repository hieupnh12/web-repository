package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.InventoryDetailsRequest;
import com.app.product_warehourse.dto.request.InventoryRequest;
import com.app.product_warehourse.dto.request.InventoryProductDetailsRequest;
import com.app.product_warehourse.dto.request.InventoryUpdateRequest;
import com.app.product_warehourse.dto.response.InventoryDetailsResponse;
import com.app.product_warehourse.dto.response.InventoryProductDetailsResponse;
import com.app.product_warehourse.dto.response.InventoryResponse;
import com.app.product_warehourse.dto.response.ReportInventoryResponse;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryService {
    InventoryRepository inventoryRepository;
    AccountRepository accountRepository;
    WarehouseAreaRepository warehouseAreaRepository;
    InventoryDetailsRepository inventoryDetailsRepository;
    InventoryProductDetailsRepository inventoryProductDetailsRepository;
    ProductVersionRepository productVersionRepository;
    ProductItemRepository productItemRepository;

    @Transactional
    public InventoryResponse createFullInventory(InventoryRequest request) {
        var context =  SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account  =  accountRepository.findByUserName(name).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        WarehouseArea area = null;
        if (request.getAreaId() != null) {
            area = warehouseAreaRepository.findById(request.getAreaId())
                    .orElseThrow(() -> new AppException(ErrorCode.WAREHOUSE_NOT_EXIST));
        }

        Inventory inventory = Inventory.builder()
                .account(account)
                .area(area)
                .status(request.getStatus() != null ? request.getStatus() : (byte) 1)
                .build();
        inventory = inventoryRepository.save(inventory);

        Long inventoryId = inventory.getInventoryId();

        if (request.getInventoryDetails() != null) {
            for (InventoryDetailsRequest detailsRequest : request.getInventoryDetails()) {
                ProductVersion productVersion = productVersionRepository.getProductVersionById(detailsRequest.getProductVersionId())
                        .orElseThrow(() -> new IllegalArgumentException("Product version not found: " + detailsRequest.getProductVersionId()));

                InventoryDetails details = InventoryDetails.builder()
                        .id(new InventoryDetailsId(inventory.getInventoryId(), detailsRequest.getProductVersionId()))
                        .inventory(inventory)
                        .productVersion(productVersion)
                        .systemQuantity(detailsRequest.getSystemQuantity())
                        .quantity(detailsRequest.getQuantity())
                        .note(detailsRequest.getNote())
                        .build();

                inventoryDetailsRepository.save(details);
            }
        }

        if (request.getInventoryProductDetails() != null) {
            for (InventoryProductDetailsRequest productDetailsRequest : request.getInventoryProductDetails()) {
                ProductItem productItem = productItemRepository.getProductItemByImei(productDetailsRequest.getImei())
                        .orElseThrow(() -> new IllegalArgumentException("Product item not found: " + productDetailsRequest.getImei()));
                ProductVersion productVersion = productVersionRepository.getProductVersionById(productDetailsRequest.getProductVersionId())
                        .orElseThrow(() -> new IllegalArgumentException("Product version not found: " + productDetailsRequest.getProductVersionId()));
                InventoryProductDetails productDetails = InventoryProductDetails.builder()
                        .id(new InventoryProductDetailsId(inventory.getInventoryId(), productDetailsRequest.getImei()))
                        .inventory(inventory)
                        .productItem(productItem)
                        .productVersion(productVersion)
                        .status(productDetailsRequest.getStatus())
                        .build();

                inventoryProductDetailsRepository.save(productDetails);
            }
        }

        return
                InventoryResponse.builder()
                .inventoryId(inventory.getInventoryId())
                .createdId(account.getStaffId())
                .areaId(area != null ? area.getId() : null)
                .status(inventory.getStatus())
                .createdAt(inventory.getCreatedAt())
                .updatedAt(inventory.getUpdatedAt())
                .inventoryDetailsList(
                        inventoryDetailsRepository.findByInventoryId(inventoryId)
                                .stream()
                                .map(d -> InventoryDetailsResponse.builder()
                                        .inventoryId(d.getId().getInventoryId())
                                        .productVersionId(d.getId().getProductVersionId())
                                        .systemQuantity(d.getSystemQuantity())
                                        .quantity(d.getQuantity())
                                        .note(d.getNote())
                                        .build())
                                .collect(Collectors.toSet())
                )
                .inventoryProductDetailsList(
                        inventoryProductDetailsRepository.findByInventoryId(inventoryId)
                                .stream()
                                .map(d -> InventoryProductDetailsResponse.builder()
                                        .inventoryId(d.getId().getInventoryId())
                                        .imei(d.getId().getImei())
                                        .status(d.getStatus())
                                        .build())
                                .collect(Collectors.toSet())
                )
                .build();
    }

    public List<ReportInventoryResponse> getInventoryReport() {
        return inventoryRepository.getInventoryReport();
    }
    @Transactional
    public void deleteInventoryById(Long id) {
      inventoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_NOT_FOUND));

        inventoryDetailsRepository.deleteByInventoryId(id);
        inventoryProductDetailsRepository.deleteByInventoryId(id);

        inventoryRepository.deleteByInventoryId(id);
    }

    @Transactional
    public void updateFullInventory(Long inventoryId, InventoryUpdateRequest request) {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account = accountRepository.findByUserName(name)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new AppException(ErrorCode.INVENTORY_NOT_FOUND));

        if (!inventory.getAccount().getStaffId().equals(account.getStaffId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        WarehouseArea area = null;
        if (request.getAreaId() != null) {
            area = warehouseAreaRepository.findById(request.getAreaId())
                    .orElseThrow(() -> new AppException(ErrorCode.WAREHOUSE_NOT_EXIST));
        }
        inventory.setArea(area);

        inventory.setStatus(request.getStatus() != null ? request.getStatus() : inventory.getStatus());

        inventory = inventoryRepository.save(inventory);

        if (request.getInventoryDetails() != null) {
            Set<InventoryDetails> existingDetails = inventoryDetailsRepository.findByInventoryId(inventoryId);
            Set<InventoryDetailsId> newDetailIds = new HashSet<>();

            for (InventoryDetailsRequest detailsRequest : request.getInventoryDetails()) {
                ProductVersion productVersion = productVersionRepository.getProductVersionById(detailsRequest.getProductVersionId())
                        .orElseThrow(() -> new IllegalArgumentException("Product version not found: " + detailsRequest.getProductVersionId()));

                InventoryDetailsId detailId = new InventoryDetailsId(inventoryId, detailsRequest.getProductVersionId());
                newDetailIds.add(detailId);

                InventoryDetails details = existingDetails.stream()
                        .filter(d -> d.getId().equals(detailId))
                        .findFirst()
                        .orElse(new InventoryDetails());

                details.setId(detailId);
                details.setInventory(inventory);
                details.setProductVersion(productVersion);
                details.setSystemQuantity(detailsRequest.getSystemQuantity());
                details.setQuantity(detailsRequest.getQuantity());
                details.setNote(detailsRequest.getNote());

                inventoryDetailsRepository.save(details);
            }

            existingDetails.stream()
                    .filter(d -> !newDetailIds.contains(d.getId()))
                    .forEach(inventoryDetailsRepository::delete);
        } else {
            inventoryDetailsRepository.deleteByInventoryId(inventoryId);
        }

        if (request.getInventoryProductDetails() != null) {
            Set<InventoryProductDetails> existingProductDetails = inventoryProductDetailsRepository.findByInventoryId(inventoryId);
            Set<InventoryProductDetailsId> newProductDetailIds = new HashSet<>();

            for (InventoryProductDetailsRequest productDetailsRequest : request.getInventoryProductDetails()) {
                ProductItem productItem = productItemRepository.getProductItemByImei(productDetailsRequest.getImei())
                        .orElseThrow(() -> new IllegalArgumentException("Product item not found: " + productDetailsRequest.getImei()));

                InventoryProductDetailsId productDetailId = new InventoryProductDetailsId(inventoryId, productDetailsRequest.getImei());
                newProductDetailIds.add(productDetailId);

                InventoryProductDetails productDetails = existingProductDetails.stream()
                        .filter(pd -> pd.getId().equals(productDetailId))
                        .findFirst()
                        .orElse(new InventoryProductDetails());

                productDetails.setId(productDetailId);
                productDetails.setInventory(inventory);
                productDetails.setProductItem(productItem);
                productDetails.setStatus(productDetailsRequest.getStatus());

                inventoryProductDetailsRepository.save(productDetails);
            }

            existingProductDetails.stream()
                    .filter(pd -> !newProductDetailIds.contains(pd.getId()))
                    .forEach(inventoryProductDetailsRepository::delete);
        } else {
            inventoryProductDetailsRepository.deleteByInventoryId(inventoryId);
        }
    }
    @Transactional
    public InventoryResponse getInventoryById(Long inventoryId) {
        var inventory = inventoryRepository.findById(inventoryId).orElseThrow(
                ()   -> new AppException(ErrorCode.INVENTORY_NOT_FOUND));
        return
                InventoryResponse.builder()
                .inventoryId(inventory.getInventoryId())
                .createdId(inventory.getAccount().getStaffId())
                .areaId(inventory.getArea() != null ? inventory.getArea().getId() : null)
                .status(inventory.getStatus())
                .createdAt(inventory.getCreatedAt())
                .updatedAt(inventory.getUpdatedAt())
                .inventoryDetailsList(
                        inventoryDetailsRepository.findByInventoryId(inventoryId)
                                .stream()
                                .map(d -> InventoryDetailsResponse.builder()
                                        .inventoryId(d.getId().getInventoryId())
                                        .productVersionId(d.getId().getProductVersionId())
                                        .systemQuantity(d.getSystemQuantity())
                                        .quantity(d.getQuantity())
                                        .note(d.getNote())
                                        .build())
                                .collect(Collectors.toSet())
                )
                .inventoryProductDetailsList(
                        inventoryProductDetailsRepository.findByInventoryId(inventoryId)
                                .stream()
                                .map(d -> InventoryProductDetailsResponse.builder()
                                        .inventoryId(d.getId().getInventoryId())
                                        .productVersionId(d.getProductVersion().getVersionId())
                                        .imei(d.getId().getImei())
                                        .status(d.getStatus())
                                        .build())
                                .collect(Collectors.toSet())
                )
                .build();
    }

    @Transactional
    public void updateProductVersionStocks(Long inventoryId) {
        // This method would update product version stocks based on inventory results
        // Implementation depends on business logic
        log.info("Updating product version stocks for inventory {}", inventoryId);

        // You might want to implement specific logic here based on requirements
        // For example, updating stock quantities based on inventory differences
    }

}