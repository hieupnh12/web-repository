package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.ProductItemRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ProductItemResponse;
import com.app.product_warehourse.entity.ProductItem;
import com.app.product_warehourse.service.ProductItemService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productItem")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductItemController {
    ProductItemService productItemService;

    @PostMapping
    public ApiResponse<ProductItem> createProductItem(@RequestBody @Valid ProductItemRequest request) {
        ApiResponse<ProductItem> response = new ApiResponse<>();
        response.setResult(productItemService.createProductItem(request));
        return response;
    }

    @GetMapping
    public ApiResponse<List<ProductItemResponse>> getAllProductItems() {
        ApiResponse<List<ProductItemResponse>> response = new ApiResponse<>();
        response.setResult(productItemService.getAllProductItems());
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProductItem(@PathVariable("id") String imei) {
        productItemService.deleteProductItemById(imei);
        return new ApiResponse<>(1005, "Successfully deleted ProductItem", null);
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductItemResponse> updateProductItem(@PathVariable("id") @Valid String imei, @RequestBody @Valid ProductItemRequest request) {
        ApiResponse<ProductItemResponse> response = new ApiResponse<>();
        response.setResult(productItemService.updateProductItem(imei, request));
        return response;
    }
}