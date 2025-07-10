package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.DayInMonthRequest;
import com.app.product_warehourse.dto.request.YearToYearRequest;
import com.app.product_warehourse.dto.response.*;
import com.app.product_warehourse.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class StatisticsService {
    ProductItemRepository productItemRepo;
    CustomerRepository customerRepo;
    StaffRepository staffRepo;
    StatisticsRepository statisticsRepo;
    WarehouseAreaRepository warehouseAreaRepo;

    public StatisticsCountsResponse getStatisticsCounts() {
        return StatisticsCountsResponse.builder()
                .itemCount(productItemRepo.countByStatus(true))
                .customerCount(customerRepo.countByStatus(true))
                .staffCount(staffRepo.countByStatus(true))
                .build();
    }

    public List<InTheLast7DaysResponse> getReport7Day() {
        return statisticsRepo.getReportInTheLast7Days();
    }

    public List<SupplierStatisticsResponse> getReportSupplier() {
        return statisticsRepo.GetSupplierStatistics();
    }

    public List<ProductInfoResponse> getReportProduct() {
        return statisticsRepo.getAllProductInfo();
    }

    public ProductInfoCountAreaResponse getReportProductCountArea() {
        return ProductInfoCountAreaResponse.builder()
                .areaCount(warehouseAreaRepo.count())
                .productInCount(productItemRepo.countByStatus(true))
                .productInfoResponses(getReportProduct())
                .build();
    }

    public List<MonthInYearResponse> getReportMonthInYear(Long year) {
        return statisticsRepo.getAllMonthInYear(year);
    }

    public List<DayInMonthResponse> getReportDayInMonth(DayInMonthRequest request) {
        String date = request.getYear() + "-" + request.getMonth() + "-1";
        System.out.println(date);
        return statisticsRepo.getAllDayInMonth(date);
    }

    public List<YearToYearResponse> getReportYearToYear(YearToYearRequest request) {
        return statisticsRepo.getAllYearToYear(request.getStartYear(), request.getEndYear());
    }
}
