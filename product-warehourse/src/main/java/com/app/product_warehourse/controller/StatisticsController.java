package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.DayInMonthRequest;
import com.app.product_warehourse.dto.request.YearToYearRequest;
import com.app.product_warehourse.dto.response.*;
import com.app.product_warehourse.service.StatisticsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/productStatistics")
    public ApiResponse<ProductInfoCountAreaResponse> productStatistics() {
        return ApiResponse.<ProductInfoCountAreaResponse>builder()
                .result(statisticsService.getReportProductCountArea())
                .build();
    }

    @GetMapping("/revenue/moth/{year}")
    public ApiResponse<List<MonthInYearResponse>> monthInYearStatistics(@PathVariable Long year ) {
        return ApiResponse.<List<MonthInYearResponse>>builder()
                .result(statisticsService.getReportMonthInYear(year))
                .build();
    }

    @GetMapping("/date")
    public ApiResponse<List<DayInMonthResponse>> dateStatistics(@RequestBody DayInMonthRequest request) {
        return ApiResponse.<List<DayInMonthResponse>>builder()
                .result(statisticsService.getReportDayInMonth(request))
                .build();
    }
    @GetMapping("/year")
    public ApiResponse<List<YearToYearResponse>> yearStatistics(@RequestBody YearToYearRequest request) {
        return ApiResponse.<List<YearToYearResponse>>builder()
                .result(statisticsService.getReportYearToYear(request))
                .build();
    }
}
