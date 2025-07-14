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
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.ImportReceiptRepository;
import com.app.product_warehourse.repository.ProductItemRepository;
import com.app.product_warehourse.repository.ProductVersionRepository;
import com.app.product_warehourse.repository.SuppliersRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.StaleObjectStateException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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
     AccountRepository accountRepository;
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
        var context =  SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account  =  accountRepository.findByUserName(name).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

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
        var context =  SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account  =  accountRepository.findByUserName(name).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

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
            throw new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND);
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
            suppliers = suppliersRepository.findById(importRequest.getSupplierId()).orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_EXIST));
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
            if (Boolean.FALSE.equals(detailRequest.getType()) && detailRequest.getImei() != null && !detailRequest.getImei().isEmpty()) {
                List<ProductItemRequest> imeiList = detailRequest.getImei();
                int quantity = detailRequest.getQuantity();

                // Validate that the list has at least one item
                if (imeiList.isEmpty()) {
                    throw new AppException(ErrorCode.IMEI_NOT_FOUND);
                }

                // Get starting IMEI from the first item
                String startImei = imeiList.get(0).getImei();

                // Validate starting IMEI format (assuming IMEI is numeric for incrementing)
                try {
                    Long.parseLong(startImei);
                } catch (NumberFormatException e) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }

                // Validate quantity
                if (quantity <= 0) {
                    throw new AppException(ErrorCode.INVALID_QUANTITY);
                }

                // Validate that quantity matches expected number of items
                if (imeiList.size() > 1 && imeiList.size() != quantity) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }

                ProductVersion version = productVersionRepo.findById(detailRequest.getProductVersionId())
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VERSION_NOT_FOUND));

                Set<String> imeis = new HashSet<>();

                // Generate and save product items for each IMEI
                for (int i = 0; i < quantity; i++) {
                    String currentImei = String.valueOf(Long.parseLong(startImei) + i);

                    // Check for duplicate IMEI
                    if (!imeis.add(currentImei)) {
                        throw new AppException(ErrorCode.IMEI_DUPLICATE);
                    }

                    ProductItemRequest item = new ProductItemRequest();
                    item.setImei(currentImei);
                    item.setImportId(savedImportEntity.getImport_id());
                    item.setProductVersionId(detailRequest.getProductVersionId());

                    ProductItem productItem = productItemMapper.ToProducItemcreate(item, version, savedImportEntity, null);
                    productItemRepo.save(productItem);
                }
            }
            if (Boolean.TRUE.equals(detailRequest.getType()) && detailRequest.getImei() != null && !detailRequest.getImei().isEmpty()) {
                List<ProductItemRequest> productItems = detailRequest.getImei();
                Set<String> imeis = new HashSet<>();
                for (ProductItemRequest item : productItems) {
                    if (item.getImei() == null || !imeis.add(item.getImei())) {
                        throw new AppException(ErrorCode.IMEI_NOT_FOUND);
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
                throw new AppException(ErrorCode.IMEI_NOT_FOUND);
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


    @Transactional
    public void deleteImportReceipt(String importId) {
        if(importrepo.existsById(importId)) {
            // Kiểm tra điều kiện: có ProductItem nào với export_id không NULL hay không
            if (importrepo.hasProductItemsWithExportId(importId) ) {
                throw new AppException(ErrorCode.PRODUCT_ITEM_HAD_EXPORT);
            }

            // Xóa ProductItem trước
            importrepo.deleteProductItemsByImportId(importId);

            // Xóa ImportReceiptDetail
            importrepo.deleteImportReceiptDetailsByImportId(importId);

            // Xóa ImportReceipt
            importrepo.deleteByImportId(importId);
        }
        else {
            throw new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND);
        }

    }




    public Page<ImportReceiptFULLResponse> searchImportReceipts(
            String supplierName,
            String staffName,
            String importId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {
        return importrepo.searchImportReceipts(
                supplierName, staffName, importId, startDate, endDate, pageable)
                .map(importmapper::toImportReceiptFULLResponse);
    }





}
