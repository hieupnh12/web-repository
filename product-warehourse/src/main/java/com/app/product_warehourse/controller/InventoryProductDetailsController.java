package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.ImeiByAreaAndVersionRequest;
import com.app.product_warehourse.dto.response.ImeiByAreaAndVersionResponse;
import com.app.product_warehourse.service.InventoryProductDetailsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/inventory-product-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryProductDetailsController {
    InventoryProductDetailsService inventoryProductDetailsService;

    @GetMapping
    public ApiResponse<List<ImeiByAreaAndVersionResponse>> getInventoryProductDetails(@RequestBody ImeiByAreaAndVersionRequest request) {
        return ApiResponse.<List<ImeiByAreaAndVersionResponse>>builder()
                .result(inventoryProductDetailsService.getImeiByAreaAndVersion(request))
                .build();
    }
}
