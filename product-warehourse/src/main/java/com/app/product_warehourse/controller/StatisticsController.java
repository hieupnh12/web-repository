package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.response.*;
import com.app.product_warehourse.service.StatisticsService;
import com.cloudinary.Api;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/statistic")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class StatisticsController {
    StatisticsService statisticsService;

    @GetMapping("/count")
    public ApiResponse<StatisticsCountsResponse> countProductItemIn() {
        return ApiResponse.<StatisticsCountsResponse>builder()
                .result(statisticsService.getStatisticsCounts())
                .build();
    }
    @GetMapping("/overviews")
    public ApiResponse<List<InTheLast7DaysResponse>> countProductItemOut() {
      return   ApiResponse.<List<InTheLast7DaysResponse>>builder()
                .result(statisticsService.getReport7Day())
                .build();
    }

    @GetMapping("/supplierStatistics")
    public ApiResponse<List<SupplierStatisticsResponse>> supplierStatistics() {
        return ApiResponse.<List<SupplierStatisticsResponse>>builder()
                .result(statisticsService.getReportSupplier())
                .build();
    }

    @GetMapping("/productStatictis")
    public ApiResponse<ProductInfoCountAreaResponse> productStatictis() {
        return ApiResponse.<ProductInfoCountAreaResponse>builder()
                .result(statisticsService.getReportProductCountArea())
                .build();
    }

}
