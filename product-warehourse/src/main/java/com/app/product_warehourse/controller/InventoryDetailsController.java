package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ReportInventoryDetailsResponse;
import com.app.product_warehourse.service.InventoryDetailsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
