package com.app.product_warehourse.service;

import com.app.product_warehourse.entity.ImportReceipt; // ✅ đúng
import com.app.product_warehourse.repository.ImportReceiptRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ImportReceiptService {

    ImportReceiptRepository importrepo;

    public ImportReceipt getImportReceipt(String id) {
        return importrepo.findById(id).orElseThrow(() -> new RuntimeException("import not found"));
    }
}
