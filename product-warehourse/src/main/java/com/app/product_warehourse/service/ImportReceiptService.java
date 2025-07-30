package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ImportReceiptDetailsRequest;
import com.app.product_warehourse.dto.request.ImportReceiptFullRequest;
import com.app.product_warehourse.dto.request.ImportReceiptRequest;
import com.app.product_warehourse.dto.request.ProductItemRequest;
import com.app.product_warehourse.dto.response.*;
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

import java.math.BigDecimal;
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
    private final ProductVersionRepository productVersionRepository;


    // Giữ nếu vẫn sử dụng Spring Security, nếu không thì xóa
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
    public ImportReceiptFULLResponse createImportReceiptFull(ImportReceiptFullRequest request) {
        if (request == null || request.getImportReceipt() == null || request.getProduct() == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        String importId = request.getImportId();
        if (importId == null) {
            throw new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND);
        }

        ImportReceipt importEntity = importrepo.findById(importId)
                .filter(i -> i.getStatus() == 0)
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));

        ImportReceiptRequest importRequest = request.getImportReceipt();
        Suppliers  suppliers = suppliersRepository.findById(importRequest.getSupplierId())
                    .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_EXIST));


        importEntity.setTotalAmount(importRequest.getTotalAmount());
        importEntity.setStatus(importRequest.getStatus());
        importEntity.setSuppliers(suppliers);

        ImportReceipt savedImportEntity;
        try {
            savedImportEntity = importrepo.save(importEntity);
        } catch (StaleObjectStateException e) {
            throw new AppException(ErrorCode.CONCURRENT_MODIFICATION);
        }

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

                if (imeiList.isEmpty()) {
                    throw new AppException(ErrorCode.IMEI_NOT_FOUND);
                }

                String startImei = imeiList.get(0).getImei();

                try {
                    Long.parseLong(startImei);
                } catch (NumberFormatException e) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }

                if (quantity <= 0) {
                    throw new AppException(ErrorCode.INVALID_QUANTITY);
                }

                if (imeiList.size() > 1 && imeiList.size() != quantity) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }

                ProductVersion version = productVersionRepo.findById(detailRequest.getProductVersionId())
                        .orElseThrow(() -> {
                            return new AppException(ErrorCode.PRODUCT_VERSION_NOT_FOUND);
                        });

                Set<String> imeis = new HashSet<>();

                for (int i = 0; i < quantity; i++) {
                    String currentImei = String.valueOf(Long.parseLong(startImei) + i);

                    if (productItemRepo.existsById(currentImei)) {
                        throw new AppException(ErrorCode.IMEI_DUPLICATE);
                    }
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
                    if (item.getImei() == null) {
                        throw new AppException(ErrorCode.IMEI_NOT_FOUND);
                    }
//                if (productItemRepo.existsById(item.getImei())) {
//                    throw new AppException(ErrorCode.IMEI_NOT_FOUND);
//                }
                    if (!imeis.add(item.getImei())) {
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
            updateStockOnImport(savedImportEntity);
//            updatePrices(detailRequest);
        }

        ImportReceiptFULLResponse savedImportReceipt = importmapper.toImportReceiptFULLResponse(savedImportEntity);
        savedImportReceipt.setDetails(savedDetails);
        savedImportReceipt.setStaffName(savedImportEntity.getStaff().getUserName());
        savedImportReceipt.setSupplierName(suppliers.getName());

        return savedImportReceipt;
    }










//    public List<ImportReceiptResponse> getAllImportReceipts() {
//         return importrepo.findAll()
//                          .stream()
//                          .map(importmapper::toImportReceiptResponse)
//                          .collect(Collectors.toList());
//    }

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Purchase Orders_VIEW')")
    public Page<ImportReceiptFULLResponse> getAllImportReceipts(Pageable pageable) {
        return importrepo.findAll(pageable)
                .map(importReceipt -> {
                    ImportReceiptFULLResponse response = importmapper.toImportReceiptFULLResponse(importReceipt);
                    // Lọc danh sách imei cho mỗi ImportReceiptDetail
                    response.getDetails().forEach(detail -> {
                        if (detail.getProductVersion() != null && importReceipt.getImportReceiptDetails() != null) {
                            // Lấy import_id của ImportReceiptDetail
                            String importId = detail.getImport_id();
                            // Lấy ImportReceiptDetail tương ứng từ importReceipt
                            ImportReceiptDetail matchingDetail = importReceipt.getImportReceiptDetails().stream()
                                    .filter(d -> d.getNewid().getImport_id().getImport_id().equals(importId)
                                            && d.getNewid().getProductVersionId().getVersionId().equals(detail.getProductVersionId()))
                                    .findFirst()
                                    .orElse(null);
                            if (matchingDetail != null && matchingDetail.getProductItems() != null) {
                                // Lọc danh sách imei từ productItems của ImportReceiptDetail
                                List<ImeiResponse> filteredImei = matchingDetail.getProductItems().stream()
                                        .map(item -> ImeiResponse.builder().imei(item.getImei()).build())
                                        .collect(Collectors.toList());
                                detail.getProductVersion().setImei(filteredImei);
                            } else {
                                // Nếu không có productItems, đặt danh sách imei rỗng
                                detail.getProductVersion().setImei(Collections.emptyList());
                            }
                        }
                    });
                    return response;
                });
    }


    public ImportReceipt getImportReceipt(String id) {
        return importrepo.findById(id).orElseThrow(() -> new RuntimeException("import not found"));
    }


    @Transactional
    public void deleteImportReceipt(String importId) {
        ImportReceipt importReceipt = importrepo.findById(importId).orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));
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
            rollbackStockOnImportDelete(importReceipt);
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
                .map(importReceipt -> {
                    ImportReceiptFULLResponse response = importmapper.toImportReceiptFULLResponse(importReceipt);
                    // Lọc danh sách imei cho mỗi ImportReceiptDetail
                    response.getDetails().forEach(detail -> {
                        if (detail.getProductVersion() != null && importReceipt.getImportReceiptDetails() != null) {
                            // Lấy import_id của ImportReceiptDetail
                            String import_id = detail.getImport_id();
                            // Lấy ImportReceiptDetail tương ứng từ importReceipt
                            ImportReceiptDetail matchingDetail = importReceipt.getImportReceiptDetails().stream()
                                    .filter(d -> d.getNewid().getImport_id().getImport_id().equals(import_id)
                                            && d.getNewid().getProductVersionId().getVersionId().equals(detail.getProductVersionId()))
                                    .findFirst()
                                    .orElse(null);
                            if (matchingDetail != null && matchingDetail.getProductItems() != null) {
                                // Lọc danh sách imei từ productItems của ImportReceiptDetail
                                List<ImeiResponse> filteredImei = matchingDetail.getProductItems().stream()
                                        .map(item -> ImeiResponse.builder().imei(item.getImei()).build())
                                        .collect(Collectors.toList());
                                detail.getProductVersion().setImei(filteredImei);
                            } else {
                                // Nếu không có productItems, đặt danh sách imei rỗng
                                detail.getProductVersion().setImei(Collections.emptyList());
                            }
                        }
                    });
                    return response;
                });
    }



    // Cập nhật stockQuantity khi thêm phiếu nhập
    @Transactional
    public void updateStockOnImport(ImportReceipt importReceipt) {
        try {
            List<ImportReceiptDetail> details = importReceipt.getImportReceiptDetails();
            for (ImportReceiptDetail detail : details) {
                ProductVersion productVersion = detail.getNewid().getProductVersionId();
                if (productVersion != null) {
                    Integer quantity = detail.getQuantity();
                    if (quantity != null && quantity > 0) {
                        productVersion.setStockQuantity(
                                productVersion.getStockQuantity() != null
                                        ? productVersion.getStockQuantity() + quantity
                                        : quantity
                        );
                        productVersionRepo.save(productVersion);
                    }
                }
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.ERROR_UPDATE_QUANTITY);
        }
    }

    // Cập nhật stockQuantity khi xóa phiếu nhập
    @Transactional
    public void rollbackStockOnImportDelete(ImportReceipt importReceipt) {
        try {
            List<ImportReceiptDetail> details = importReceipt.getImportReceiptDetails();
            for (ImportReceiptDetail detail : details) {
                ProductVersion productVersion = detail.getNewid().getProductVersionId();
                if (productVersion != null) {
                    Integer quantity = detail.getQuantity();
                    if (quantity != null && quantity > 0) {
                        productVersion.setStockQuantity(
                                productVersion.getStockQuantity() != null
                                        ? productVersion.getStockQuantity() - quantity
                                        : 0
                        );
                        productVersionRepo.save(productVersion);
                    }
                }
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.ERROR_UPDATE_QUANTITY);
        }
    }





    @Transactional
    public void updatePrices(ImportReceiptDetailsRequest importReceiptDetail) {
        ImportReceiptDetail im = new ImportReceiptDetail();

        // Lấy product_version_id từ khóa composite
        String productVersionId = im.getNewid().getProductVersionId().getVersionId();

        // Tìm ProductVersion tương ứng
        ProductVersion productVersion = productVersionRepository.findById(productVersionId)
                .orElseThrow(() -> new IllegalArgumentException("ProductVersion not found with id: " + productVersionId));

        // Cập nhật import_price từ unit_price
        BigDecimal unitPrice = BigDecimal.valueOf(importReceiptDetail.getUnitPrice());
        productVersion.setImportPrice(unitPrice);

        // Tính toán export_price dựa trên import_price (ví dụ: thêm 20% lợi nhuận)
        BigDecimal exportPrice = calculateExportPrice(unitPrice);
        productVersion.setExportPrice(exportPrice);

        // Lưu ProductVersion
        productVersionRepository.save(productVersion);
    }

    // Công thức tính export_price (có thể tùy chỉnh)
    private BigDecimal calculateExportPrice(BigDecimal importPrice) {
        // Ví dụ: export_price = import_price * 1.2 (thêm 20% lợi nhuận)
        return importPrice.multiply(BigDecimal.valueOf(1.2));
    }



}
