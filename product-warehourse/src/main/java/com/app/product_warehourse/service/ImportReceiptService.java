package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ImportReceiptDetailsRequest;
import com.app.product_warehourse.dto.request.ImportReceiptFullRequest;
import com.app.product_warehourse.dto.request.ImportReceiptRequest;
import com.app.product_warehourse.dto.request.ProductItemRequest;
import com.app.product_warehourse.dto.response.ImportReceiptDetailsResponse;
import com.app.product_warehourse.dto.response.ImportReceiptFULLResponse;
import com.app.product_warehourse.dto.response.ImportReceiptResponse;
import com.app.product_warehourse.dto.response.ProductItemResponse;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.ImportReceiptMapper;
import com.app.product_warehourse.mapper.ProductItemMapper;
import com.app.product_warehourse.repository.ImportReceiptRepository;
import com.app.product_warehourse.repository.ProductItemRepository;
import com.app.product_warehourse.repository.ProductVersionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.StaleObjectStateException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
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
    ImportReceiptDetailsService importReceiptDetailsService;
    ProductItemRepository productItemRepo;
    ProductVersionRepository productVersionRepo;
    ProductItemMapper productItemMapper;
    SuppliersRepository suppliersRepository;


    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')") // Giữ nếu vẫn sử dụng Spring Security, nếu không thì xóa
    public ImportReceiptFULLResponse initImportReceipt(ImportReceiptFullRequest request) {
        log.info("Creating import receipt with request: {}", request);


        // Validate account
        Account account = accountService.getAccountEntity(request.getImportReceipt().getStaffId());
        if (account == null) {
            log.error("Account not found: {}",request.getImportReceipt().getStaffId());
            throw new AppException(ErrorCode.ACCOUNT_NOT_EXIST);
        }

        // Create and save import receipt
        ImportReceipt importReceipt = importmapper.ImportReceiptMake(request.getImportReceipt(), null, account);
        ImportReceipt savedReceipt = importrepo.save(importReceipt);


        // Map to response DTO
        return importmapper.toImportReceiptFULLResponse(savedReceipt);
    }





    //method tao import receipt simple
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ImportReceiptFULLResponse createImportReceipt(ImportReceiptRequest request) {
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
        return importmapper.toImportReceiptFULLResponse(savedReceipt);
    }





    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ImportReceiptFULLResponse createImportReceiptFull(ImportReceiptFullRequest request) {
        // Kiểm tra request hợp lệ
        if (request == null || request.getImportReceipt() == null || request.getProduct() == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Lấy import_id từ request
        String importId = request.getImportId();
        if (importId == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Tìm phiếu nhập draft
        ImportReceipt importEntity = importrepo.findById(importId)
                .filter(i -> i.getStatus() == 0) // Chỉ cho phép cập nhật nếu trạng thái là draft
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));

        // Lấy thông tin từ ImportReceiptRequest
        ImportReceiptRequest importRequest = request.getImportReceipt();

        // Tra cứu Suppliers (nếu có)
        Suppliers suppliers = null;
        if (importRequest.getSupplierId() != null) {
            suppliers = suppliersRepository.findById(importRequest.getSupplierId());
        }

        // Cập nhật thông tin phiếu nhập
        importEntity.setTotalAmount(importRequest.getTotalAmount());
        importEntity.setStatus(importRequest.getStatus());
        importEntity.setSuppliers(suppliers);

        // Lưu bản ghi và xử lý lỗi StaleObjectStateException
        ImportReceipt savedImportEntity;
        try {
            savedImportEntity = importrepo.save(importEntity);
        } catch (StaleObjectStateException e) {
            throw new AppException(ErrorCode.CONCURRENT_MODIFICATION);
        }

        // Xử lý chi tiết phiếu nhập
        List<ImportReceiptDetailsRequest> detailsRequests = request.getProduct();
        if (detailsRequests.isEmpty()) {
            throw new AppException(ErrorCode.IMPORT_DETAIL_NOT_EXIST);
        }

        List<ImportReceiptDetailsResponse> savedDetails = new ArrayList<>();
        for (ImportReceiptDetailsRequest detailRequest : detailsRequests) {
            detailRequest.setImport_id(savedImportEntity.getImport_id());

            if (detailRequest.getProductVersionId() == null || detailRequest.getQuantity() == null || detailRequest.getUnitPrice() == null) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            if (detailRequest.getQuantity() < 0) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            ImportReceiptDetailsResponse detailResponse = importReceiptDetailsService.createImportReceiptDetails(detailRequest);
            savedDetails.add(detailResponse);

            if (Boolean.TRUE.equals(detailRequest.getType()) && detailRequest.getImei() != null && !detailRequest.getImei().isEmpty()) {
                List<ProductItemRequest> productItems = detailRequest.getImei();
                Set<String> imeis = new HashSet<>();
                for (ProductItemRequest item : productItems) {
                    if (item.getImei() == null || !imeis.add(item.getImei())) {
                        throw new AppException(ErrorCode.INVALID_REQUEST);
                    }
                    item.setImportId(savedImportEntity.getImport_id());
                    item.setProductVersionId(detailRequest.getProductVersionId());

                    ProductVersion version = productVersionRepo.findById(item.getProductVersionId())
                            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VERSION_NOT_FOUND));
                    ProductItem productItem = productItemMapper.ToProducItemcreate(item, version, savedImportEntity, null);
                    productItemRepo.save(productItem);
                }
                if (productItems.size() != detailRequest.getQuantity()) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
            } else if (Boolean.TRUE.equals(detailRequest.getType()) && (detailRequest.getImei() == null || detailRequest.getImei().isEmpty())) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
        }

        // Chuyển đổi sang ImportReceiptFULLResponse với details
        ImportReceiptFULLResponse savedImportReceipt = importmapper.toImportReceiptFULLResponse(savedImportEntity);
        savedImportReceipt.setDetails(savedDetails);
        savedImportReceipt.setStaffName(savedImportEntity.getStaff().getUserName());
        savedImportReceipt.setSupplierName(suppliers != null ? suppliers.getName() : null);

        return savedImportReceipt;
    }










//    public List<ImportReceiptResponse> getAllImportReceipts() {
//         return importrepo.findAll()
//                          .stream()
//                          .map(importmapper::toImportReceiptResponse)
//                          .collect(Collectors.toList());
//    }


    public Page<ImportReceiptFULLResponse> getAllImportReceipts(Pageable pageable) {
        return importrepo.findAll(pageable)
                .map(importmapper::toImportReceiptFULLResponse);
    }


    public ImportReceipt getImportReceipt(String id) {
        return importrepo.findById(id).orElseThrow(() -> new RuntimeException("import not found"));
    }


    public void deleteImportReceipt(String id) {
        importrepo.deleteById(id);
    }

}
