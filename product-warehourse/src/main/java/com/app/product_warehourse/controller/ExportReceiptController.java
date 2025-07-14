package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ExportReceiptFullRequest;
import com.app.product_warehourse.dto.request.ExportReceiptRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ExportReceiptFULLResponse;
import com.app.product_warehourse.dto.response.ExportReceiptResponse;
import com.app.product_warehourse.dto.response.ImportReceiptFULLResponse;
import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.service.ExportReceiptService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j

@RestController
@RequestMapping("/exportReceipt")
public class ExportReceiptController {

       ExportReceiptService exportReceiptService;

//       @PostMapping
//     public ApiResponse<ExportReceipt> addexportReceipt(@RequestBody @Valid ExportReceiptRequest request, BindingResult result) {
//           if (result.hasErrors()) {
//               log.error("Validation errors: {}", result.getAllErrors());
//               throw new RuntimeException("Invalid request: " + result.getAllErrors());
//           }
//           log.info("Request received: {}", request);
//           return ApiResponse.<ExportReceipt>builder()
//                   .result(exportReceiptService.CreateExportReceipt(request))
//                   .build();
//       }

    @PostMapping("/init")
    public ApiResponse<ExportReceiptFULLResponse> initExportReceipt(@Valid @RequestBody ExportReceiptFullRequest request) {
        return ApiResponse.<ExportReceiptFULLResponse>builder()
                .result(exportReceiptService.initExportReceipt(request))
                .build();
    }

    @PostMapping("/full/confirm")
    public ApiResponse<ExportReceiptFULLResponse> createExportReceipt(@Valid @RequestBody ExportReceiptFullRequest request) {
          return ApiResponse.<ExportReceiptFULLResponse>builder()
                  .result(exportReceiptService.createImportReceiptFull(request))
                  .build();
    }


     @GetMapping
    public ApiResponse<Page<ExportReceiptFULLResponse>> getAllExportReceipts(
             @RequestParam(defaultValue = "0") int page,
             @RequestParam(defaultValue = "10") int size) {
         Pageable pageable = PageRequest.of(page, size);
         return ApiResponse.<Page<ExportReceiptFULLResponse>>builder()
                   .result(exportReceiptService.GetAllExportReceipt(pageable))
                   .build();
     }



     @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAllExportReceipts(@PathVariable String id) {
           exportReceiptService.deleteExportReceipt(id);
           return ApiResponse.<Void>builder()
                   .message("Delete ExportReceipt Successfull")
                   .build();
     }



    @GetMapping("/export-receipts")
    public Page<ExportReceiptFULLResponse> searchExportReceipts(
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String staffName,
            @RequestParam(required = false) String exportId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return exportReceiptService.searchExportReceipts(
                customerName, staffName, exportId, startDate, endDate, pageable);
    }



}
