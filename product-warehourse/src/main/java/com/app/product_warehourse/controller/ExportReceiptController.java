package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ExportReceiptFullRequest;
import com.app.product_warehourse.dto.request.ExportReceiptRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ExportReceiptFULLResponse;
import com.app.product_warehourse.dto.response.ExportReceiptResponse;
import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.service.ExportReceiptService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

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
    public ApiResponse<List<ExportReceiptResponse>> getAllExportReceipts() {
           return ApiResponse.<List<ExportReceiptResponse>>builder()
                   .result(exportReceiptService.GetAllExportReceipt())
                   .build();
     }



     @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAllExportReceipts(@PathVariable String id) {
           exportReceiptService.deleteExportReceipt(id);
           return ApiResponse.<Void>builder()
                   .message("Delete ExportReceipt Successfull")
                   .build();
     }

}
