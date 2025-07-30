package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ImeiByAreaAndVersionRequest;
import com.app.product_warehourse.dto.request.InventoryProductDetailsGetRequest;
import com.app.product_warehourse.dto.request.InventoryProductDetailsRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ImeiByAreaAndVersionResponse;
import com.app.product_warehourse.dto.response.InventoryProductDetailsResponse;
import com.app.product_warehourse.service.InventoryProductDetailsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory-product-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryProductDetailsController {
    InventoryProductDetailsService inventoryProductDetailsService;

    @PostMapping("/by-area-version")
    public ApiResponse<List<ImeiByAreaAndVersionResponse>> getInventoryProductDetails(@RequestBody ImeiByAreaAndVersionRequest request) {
        return ApiResponse.<List<ImeiByAreaAndVersionResponse>>builder()
                .result(inventoryProductDetailsService.getImeiByAreaAndVersion(request))
                .build();
    }

    @PostMapping
    public ApiResponse<List<InventoryProductDetailsResponse>> getInventoryProductDetailsByInventoryId(@RequestBody InventoryProductDetailsGetRequest request) {
        return ApiResponse.<List<InventoryProductDetailsResponse>>builder()
                .result(inventoryProductDetailsService.getInventoryProductDetailsByInventoryId(request.getInventoryId()))
                .build();
    }

    @PostMapping("/{inventoryId}")
    public ApiResponse<Void> saveInventoryProductDetails(
            @PathVariable Long inventoryId,
            @RequestBody List<InventoryProductDetailsRequest> productDetailsRequests) {
        inventoryProductDetailsService.saveInventoryProductDetails(inventoryId, productDetailsRequests);
        return ApiResponse.<Void>builder()
                .message("Inventory product details saved successfully")
                .build();
    }

    @PostMapping("/mark-missing/{inventoryId}/{productVersionId}")
    public ApiResponse<Void> markMissingIMEI(
            @PathVariable Long inventoryId,
            @PathVariable String productVersionId) {
        inventoryProductDetailsService.markMissingIMEI(inventoryId, productVersionId);
        return ApiResponse.<Void>builder()
                .message("IMEI marked as missing successfully")
                .build();
    }
}
