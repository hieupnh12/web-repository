package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.response.ReportInventoryDetailsResponse;
import com.app.product_warehourse.repository.InventoryDetailsRepository;
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
public class InventoryDetailsService {
    InventoryDetailsRepository inventoryDetailsRepository;

    public List<ReportInventoryDetailsResponse> getReportInventoryDetails(Long productId) {
      return inventoryDetailsRepository.getReportInventoryDetailsByInventoryId(productId);
    }
}
