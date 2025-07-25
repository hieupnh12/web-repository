package com.app.product_warehourse.service;


import com.app.product_warehourse.entity.ProductItem;
import com.app.product_warehourse.mapper.ImportReceiptMapper;
import com.app.product_warehourse.mapper.ProductItemMapper;
import com.app.product_warehourse.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CountQuantityOfAll {

    AccountRepository accountRepository;
    AccountService accountService;
    ImportReceiptRepository importrepo;
    ImportReceiptMapper importmapper;
    ImportReceiptService importreceiptservice;
    ImportReceiptDetailsService importReceiptDetailsService;
    ExportReceiptRepository exportrepo;
    SupplierService supplierService;
    SuppliersRepository suppliersRepository;
    ProductVersionRepository productVersionRepo;
    ProductVersionRepository productVersionRepository;
    ProductItemMapper productItemMapper;
    ProductItemRepository productItemRepo;
    ProductItemService productItemService;
   CustomerRepository customerRepository;





    public Map<String, Object> calculateImeiStats() {
        List<ProductItem> items = productItemRepo.findAll();
        long verifiedCount = items.stream()
                .filter(item -> item.getExport_id() != null)
                .count();
        int totalItems = items.size();
        double accuracy = (verifiedCount > 0 && totalItems > 0)
                ? (double) verifiedCount / totalItems * 100
                : 0.0;
        Map<String, Object> stats = new HashMap<>();
        stats.put("verifiedCount", (int) verifiedCount);
        stats.put("accuracy", accuracy);
        return stats;
    }




    public Map<String, Object> getExportStats() {
        // Lấy ngày hôm nay và hôm qua
        LocalDate today = LocalDate.now(); // 23/07/2025
        LocalDate yesterday = today.minusDays(1); // 22/07/2025

        // Tạo range thời gian cho hôm nay (từ 00:00 đến 23:59)
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);

        // Tạo range thời gian cho hôm qua
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = yesterday.atTime(LocalTime.MAX);

        // Đếm số đơn xuất hàng hôm nay
        long todayCount = exportrepo.countByExportTimeBetween(startOfToday, endOfToday);

        // Đếm số đơn xuất hàng hôm qua
        long yesterdayCount = exportrepo.countByExportTimeBetween(startOfYesterday, endOfYesterday);

        // Tính số đơn tăng và phần trăm tăng
        long increaseCount = todayCount - yesterdayCount;
        increaseCount = increaseCount < 0 ? 0 : increaseCount;
        double percentageIncrease = (yesterdayCount > 0) ? ((double) (todayCount - yesterdayCount) / yesterdayCount) * 100 : 0.0;
        percentageIncrease = percentageIncrease < 0 ? 0.0 : percentageIncrease;

        // Trả về Map chứa kết quả
        Map<String, Object> stats = new HashMap<>();
        stats.put("todayCount", todayCount);
        stats.put("yesterdayCount", yesterdayCount);
        stats.put("increaseCount", increaseCount);
        stats.put("percentageIncrease", percentageIncrease);

        return stats;
    }



    public Map<String, Object> calculateProductStats() {
        Map<String, Object> stats = new HashMap<>();
        LocalDate today = LocalDate.now(); // 25/07/2025
        LocalDate yesterday = today.minusDays(1); // 24/07/2025

        // 1. Tổng số lượng sản phẩm hiện có
        long totalProducts = productItemRepo.countActiveProducts();
        stats.put("totalProducts", totalProducts);

        // 2. Số lượng sản phẩm tăng (từ phiếu nhập hôm nay)
        long todayIncrease = importrepo.sumQuantityByImportDate(today) != null
                ? importrepo.sumQuantityByImportDate(today) : 0L;
        stats.put("todayIncrease", todayIncrease);

        // 3. Tổng số lượng sản phẩm ngày hôm qua
        long yesterdayTotal = importrepo.sumQuantityUpToDate(yesterday) != null
                ? importrepo.sumQuantityUpToDate(yesterday) : 0L;

        // 4. Tính phần trăm tăng/giảm
        double percentageIncrease = calculatePercentageIncrease(totalProducts, yesterdayTotal);
        stats.put("percentageIncrease", percentageIncrease);

        return stats;
    }

    private double calculatePercentageIncrease(long todayTotal, long yesterdayTotal) {
        if (yesterdayTotal == 0) {
            return todayTotal > 0 ? 100.0 : 0.0; // Nếu hôm qua không có, hôm nay có thì 100%
        }
        double change = ((double) (todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
        return change < 0 ? 0.0 : change; // Nếu giảm, trả về 0
    }





    public Map<String, Object> calculateCustomerStats() {
        Map<String, Object> stats = new HashMap<>();
        LocalDate today = LocalDate.now(); // 25/07/2025
        LocalDate yesterday = today.minusDays(1); // 24/07/2025

        // 1. Tổng số lượng khách hàng hiện có (status = true)
        long totalCustomers = customerRepository.countActiveCustomers();
        stats.put("totalCustomers", totalCustomers);

        // 2. Số lượng khách hàng tăng (khách hàng mới trong ngày hôm nay)
        long todayIncrease = customerRepository.countNewCustomersByDate(today) != null
                ? customerRepository.countNewCustomersByDate(today) : 0L;
        stats.put("todayIncrease", todayIncrease);

        // 3. Tổng số lượng khách hàng đến hết ngày hôm qua
        long yesterdayTotal = customerRepository.countCustomersUpToDate(yesterday) != null
                ? customerRepository.countCustomersUpToDate(yesterday) : 0L;

        // 4. Tính phần trăm tăng/giảm
        double percentageIncrease = calculatePercentageIncrease(totalCustomers, yesterdayTotal);
        stats.put("percentageIncrease", percentageIncrease);

        return stats;
    }



}
