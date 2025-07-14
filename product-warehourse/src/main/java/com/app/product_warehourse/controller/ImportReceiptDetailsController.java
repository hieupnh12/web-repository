package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ImportReceiptDetailsRequest;
import com.app.product_warehourse.dto.request.ImportReceiptDetailsUpdateRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ImportReceiptDetailsResponse;
import com.app.product_warehourse.service.ImportReceiptDetailsService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/importDetail")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ImportReceiptDetailsController {

    ImportReceiptDetailsService importDservice;

//    @PostMapping
//    public ApiResponse<ImportReceiptDetailsResponse> addImportReceiptDetails(@RequestBody ImportReceiptDetailsRequest request) {
//        log.info("Nhận được ImportReceiptDetailsRequest: {}", request);
//        ApiResponse<ImportReceiptDetailsResponse> apiResponse = new ApiResponse<>();
//        apiResponse.setResult(importDservice.createImportReceiptDetails(request));
//        return apiResponse;
//    }


    @GetMapping
    public ApiResponse<List<ImportReceiptDetailsResponse>> getImportReceiptDetails() {
        ApiResponse<List<ImportReceiptDetailsResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(importDservice.getAllImportReceiptDetails());
        return apiResponse;
    }


    @PutMapping("/{import_id}/{productVersion_id}")
    public ApiResponse<ImportReceiptDetailsResponse> updateImportReceiptDetails(@RequestBody @Valid ImportReceiptDetailsUpdateRequest request,
                                                                                @PathVariable String import_id,
                                                                                @PathVariable String productVersion_id) {
        ApiResponse<ImportReceiptDetailsResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(importDservice.UpdateImportReceiptDetails(request,import_id,productVersion_id));
        return apiResponse;
    }


    @DeleteMapping("/{import_id}/{productVersion_id}")
    public  ApiResponse<Void> deleteImportReceiptDetails(@PathVariable String import_id,
                                                         @PathVariable String productVersion_id) {
        ApiResponse<Void> api = new ApiResponse<>();
        importDservice.deleteImportReceiptDetails(import_id,productVersion_id);
        api.setCode(300);
        api.setMessage("Delete Import Receipt Details successful");
        return api;
    }









}
