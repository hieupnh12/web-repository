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
        double percentageIncrease = (yesterdayCount > 0) ? ((double) (todayCount - yesterdayCount) / yesterdayCount) * 100 : 0.0;

        // Trả về Map chứa kết quả
        Map<String, Object> stats = new HashMap<>();
        stats.put("todayCount", todayCount);
        stats.put("yesterdayCount", yesterdayCount);
        stats.put("increaseCount", increaseCount);
        stats.put("percentageIncrease", percentageIncrease);

        return stats;
    }


}
