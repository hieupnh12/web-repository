package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ImportReceiptDetailsRequest;
import com.app.product_warehourse.dto.request.ImportReceiptRequest;
import com.app.product_warehourse.dto.request.ProductItemRequest;
import com.app.product_warehourse.dto.response.ImportReceiptResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.ImportReceipt; // ✅ đúng
import com.app.product_warehourse.entity.Staff;
import com.app.product_warehourse.entity.Suppliers;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.ImportReceiptMapper;
import com.app.product_warehourse.repository.ImportReceiptRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ImportReceiptService {

    ImportReceiptRepository importrepo;
    ImportReceiptMapper importmapper;
    SupplierService supplierService;
    AccountService accountService;



//    public ImportReceipt createImportReceipt(ImportReceiptRequest request) {
//         Suppliers supp  = supplierService.getSupplier(request.getSupplierId());
//         if(supp == null) {
//             throw new AppException(ErrorCode.SUPPLIER_NOT_EXIST);
//         }
//         Account account = accountService.getAccount(request.getStaffId());
//         if(account == null) {
//             throw new AppException(ErrorCode.ACCOUNT_NOT_EXIST);
//         }
//
//         ImportReceipt importreceipt = importmapper.ImportReceiptMake(request, supp, account);
//         ImportReceipt imports = importrepo.save(importreceipt);
//         return imports;
//    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ImportReceiptResponse createImportReceipt(ImportReceiptRequest request) {
        log.info("Creating import receipt with request: {}", request);

        // Validate supplier
        Suppliers supplier = supplierService.getSupplier(request.getSupplierId());
        if (supplier == null) {
            log.error("Supplier not found: {}", request.getSupplierId());
            throw new AppException(ErrorCode.SUPPLIER_NOT_EXIST);
        }

        // Validate account
        Account account = accountService.getAccountEntity(request.getStaffId());
        if (account == null) {
            log.error("Account not found: {}", request.getStaffId());
            throw new AppException(ErrorCode.ACCOUNT_NOT_EXIST);
        }

        // Create and save import receipt
        ImportReceipt importReceipt = importmapper.ImportReceiptMake(request, supplier, account);
        ImportReceipt savedReceipt = importrepo.save(importReceipt);

        // Map to response DTO
        return importmapper.toImportReceiptResponse(savedReceipt);
    }



//    public ImportReceiptResponse createImportReceiptResponse(ImportReceipt request1, ImportReceiptDetailsRequest request2, ProductItemRequest request3) {
//
//    }











    public List<ImportReceiptResponse> getAllImportReceipts() {
         return importrepo.findAll()
                          .stream()
                          .map(importmapper::toImportReceiptResponse)
                          .collect(Collectors.toList());
    }




    public ImportReceipt getImportReceipt(String id) {
        return importrepo.findById(id).orElseThrow(() -> new RuntimeException("import not found"));
    }


    public void deleteImportReceipt(String id) {
        importrepo.deleteById(id);
    }

}
