package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.InventoryDetailsRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ReportInventoryDetailsResponse;
import com.app.product_warehourse.service.InventoryDetailsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryDetailsController {
    InventoryDetailsService inventoryDetailsService;

    @GetMapping("/{id}")
    public ApiResponse<List<ReportInventoryDetailsResponse>> getReportInventoryDetails(@PathVariable Long id) {
        return ApiResponse.<List<ReportInventoryDetailsResponse>>builder()
                .result(inventoryDetailsService.getReportInventoryDetails(id))
                .build();
    }

    @PostMapping("/{inventoryId}")
    public ApiResponse<Void> saveInventoryDetails(
            @PathVariable Long inventoryId,
            @RequestBody List<InventoryDetailsRequest> detailsRequests) {
        inventoryDetailsService.saveInventoryDetails(inventoryId, detailsRequests);
        return ApiResponse.<Void>builder()
                .message("Inventory details saved successfully")
                .build();
    }
}
