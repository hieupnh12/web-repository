package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ImportReceiptFullRequest;
import com.app.product_warehourse.dto.request.ImportReceiptRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ImportReceiptFULLResponse;
import com.app.product_warehourse.dto.response.ImportReceiptResponse;
import com.app.product_warehourse.entity.ImportReceipt;
import com.app.product_warehourse.service.ImportReceiptService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/importReceipt")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ImportReceiptController {
        ImportReceiptService importservice;


//        @PostMapping
//        @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')") // Có thể xóa nếu không dùng authentication
//        @ResponseStatus(HttpStatus.CREATED)
//        public ApiResponse<ImportReceiptFULLResponse> createImportReceipt(@Valid @RequestBody ImportReceiptRequest request) {
//                ApiResponse<ImportReceiptFULLResponse> response = new ApiResponse<>();
//                response.setResult(importservice.createImportReceipt(request));
//                return response;
//        }

        //xác nhận (/full/confirm)
        @PostMapping("/full/confirm")
        public ApiResponse<ImportReceiptFULLResponse> confirmImportReceipt(@Valid @RequestBody ImportReceiptFullRequest request) {
                return ApiResponse.<ImportReceiptFULLResponse>builder()
                        .result(importservice.createImportReceiptFull(request))
                        .build();
        }


        @PostMapping("/init")
        @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
        public ApiResponse<ImportReceiptFULLResponse> initImportReceipt(@Valid @RequestBody ImportReceiptFullRequest request) {
                return ApiResponse.<ImportReceiptFULLResponse>builder()
                        .result(importservice.initImportReceipt(request))
                        .build();
        }




        @GetMapping
        public ApiResponse<Page<ImportReceiptFULLResponse>> getAllImportReceipts(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
                ApiResponse<Page<ImportReceiptFULLResponse>> response = new ApiResponse<>();
                response.setResult(importservice.getAllImportReceipts(pageable));
                return response;
        }


        @DeleteMapping("/{id}")
        public ApiResponse<ImportReceiptResponse> deleteImportReceipt(@PathVariable("id") String id) {
                ApiResponse<ImportReceiptResponse> response = new ApiResponse<>();
                importservice.deleteImportReceipt(id);
                response.setMessage("Successfully deleted importReceipt");
                return response;
        }


        @GetMapping("/import-receipts")
        public Page<ImportReceiptFULLResponse> searchImportReceipts(
                @RequestParam(required = false) String supplierName,
                @RequestParam(required = false) String staffName,
                @RequestParam(required = false) String importId,
                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
                return importservice.searchImportReceipts(
                        supplierName, staffName, importId, startDate, endDate, pageable);
        }


}
