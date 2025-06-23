package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ImportReceiptRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ImportReceiptResponse;
import com.app.product_warehourse.entity.ImportReceipt;
import com.app.product_warehourse.service.ImportReceiptService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/importReceipt")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ImportReceiptController {
        ImportReceiptService importservice;

//        @PostMapping
//        public ApiResponse<ImportReceipt> createImportReceipt(@RequestBody ImportReceiptRequest request) {
//                ApiResponse<ImportReceipt> response = new ApiResponse<>();
//                response.setResult(importservice.createImportReceipt(request));
//                return response;
//        }


        @PostMapping
        @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
        @ResponseStatus(HttpStatus.CREATED)
        public ApiResponse<ImportReceiptResponse> createImportReceipt(@Valid @RequestBody ImportReceiptRequest request) {
                ApiResponse<ImportReceiptResponse> response = new ApiResponse<>();
                response.setResult(importservice.createImportReceipt(request));
                return response;
        }



        @GetMapping
        public ApiResponse<List<ImportReceiptResponse>> getAllImportReceipts() {
                ApiResponse<List<ImportReceiptResponse>> response = new ApiResponse<>();
                response.setResult(importservice.getAllImportReceipts());
                return response;
        }


        @DeleteMapping("/{id}")
        public ApiResponse<ImportReceiptResponse> deleteImportReceipt(@PathVariable("id") String id) {
                ApiResponse<ImportReceiptResponse> response = new ApiResponse<>();
                importservice.deleteImportReceipt(id);
                response.setMessage("Successfully deleted importReceipt");
                return response;
        }


}
