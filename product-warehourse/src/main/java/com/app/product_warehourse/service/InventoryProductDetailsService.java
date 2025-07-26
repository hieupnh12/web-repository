package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ImeiByAreaAndVersionRequest;
import com.app.product_warehourse.dto.response.ImeiByAreaAndVersionResponse;
import com.app.product_warehourse.repository.InventoryProductDetailsRepository;
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
public class InventoryProductDetailsService {
    InventoryProductDetailsRepository inventoryProductDetailsRepository;

    public List<ImeiByAreaAndVersionResponse> getImeiByAreaAndVersion(ImeiByAreaAndVersionRequest request) {
       return inventoryProductDetailsRepository.findImeiByAreaAndVersion(request.getAreaId(), request.getVersionId());
    }
}
