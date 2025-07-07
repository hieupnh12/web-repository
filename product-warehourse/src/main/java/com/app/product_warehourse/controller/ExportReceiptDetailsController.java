package com.app.product_warehourse.controller;



import com.app.product_warehourse.dto.request.ApiResponse;
import com.app.product_warehourse.dto.request.ExportReceiptDetailUpdateRequest;
import com.app.product_warehourse.dto.request.ExportReceiptDetailsRequest;
import com.app.product_warehourse.dto.response.ExportReceiptDetailsResponse;
import com.app.product_warehourse.entity.ExportReceiptDetail;
import com.app.product_warehourse.service.ExportReceiptDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor  // thay cho autowrid
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
@RestController
@RequestMapping("/exportDetail")
public class ExportReceiptDetailsController {

    ExportReceiptDetailService exDservice;


       @PostMapping
     public ApiResponse<ExportReceiptDetailsResponse> AddExportReceiptDetail(@RequestBody ExportReceiptDetailsRequest request) {
           return ApiResponse.<ExportReceiptDetailsResponse>builder()
                   .result(exDservice.CreateExportReceiptDetails(request))
                   .build();
       }


       @GetMapping
    public ApiResponse<List<ExportReceiptDetailsResponse>> GetExportReceiptDetails() {
           return ApiResponse.<List<ExportReceiptDetailsResponse>>builder()
                   .result(exDservice.GetAllExportReceiptDetails())
                   .build();
       }



       @DeleteMapping("/{export_id}/{item_id}")
    public ApiResponse<Void> DeleteExportReceiptDetails(@PathVariable("export_id") String export_id,@PathVariable("item_id") String productVersionId) {
           exDservice.DeleteExportReceiptDetail(export_id,productVersionId);
           return ApiResponse.<Void>builder()
                   .message("Delete export receipt detail")
                   .build();
       }



       @PutMapping("/{export_id}/{productVersionId}")
    public ApiResponse<ExportReceiptDetailsResponse> UpdateExportReceiptDetails(ExportReceiptDetailUpdateRequest request,
                                                                                @PathVariable("export_id") String export_id,
                                                                                @PathVariable("productVersionId") String productVersionId) {
           return ApiResponse.<ExportReceiptDetailsResponse>builder()
                   .result(exDservice.UpdateExportReceiptDetail(request, export_id, productVersionId))
                   .message("Update export receipt detail")
                   .build();
       }

}
