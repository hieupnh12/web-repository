package com.app.product_warehourse.service;

import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.repository.ExportReceiptRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ExportReceiptService {

    ExportReceiptRepository repo;

    public ExportReceipt getExportreceipt(String id) {
        return repo.findById(id).orElseThrow(()-> new RuntimeException("export_receipt not found"));
    }
}
