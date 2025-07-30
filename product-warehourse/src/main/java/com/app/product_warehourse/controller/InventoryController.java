package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.InventoryRequest;
import com.app.product_warehourse.dto.request.InventoryUpdateRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.InventoryResponse;
import com.app.product_warehourse.dto.response.ReportInventoryResponse;
import com.app.product_warehourse.service.InventoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryController {
    InventoryService inventoryService;


    @PostMapping
    public ApiResponse<InventoryResponse> addInventory(@RequestBody InventoryRequest request) {
        inventoryService.createFullInventory(request);
        return ApiResponse.<InventoryResponse>builder()
                .result(inventoryService.createFullInventory(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ReportInventoryResponse>> getAllInventory() {
        return ApiResponse.<List<ReportInventoryResponse>>builder()
                .result(inventoryService.getInventoryReport())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventoryById(id);
        return ApiResponse.<Void>builder()
                .message("Delete inventory successfully")
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateInventory(@PathVariable Long id, @RequestBody InventoryUpdateRequest request) {
       inventoryService.updateFullInventory(id, request);
        return ApiResponse.<Void>builder()
                .message("Update inventory has successful")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<InventoryResponse> getInventoryById(@PathVariable Long id) {
        return ApiResponse.<InventoryResponse>builder()
                .result(inventoryService.getInventoryById(id))
                .build();
    }

    @PutMapping("/update-stocks/{inventoryId}")
    public ApiResponse<Void> updateProductVersionStocks(@PathVariable Long inventoryId) {
        inventoryService.updateProductVersionStocks(inventoryId);
        return ApiResponse.<Void>builder()
                .message("Product version stocks updated successfully")
                .build();
    }
}
