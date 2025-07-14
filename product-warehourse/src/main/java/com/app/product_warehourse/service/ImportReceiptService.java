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
        log.info("Starting creation of import receipt with request ID: {}", request != null ? request.getImportId() : "null");

        // Validate request
        log.info("Checking if request is null: {}", request == null);
        if (request == null || request.getImportReceipt() == null || request.getProduct() == null) {
            log.error("Invalid request: request={}, importReceipt={}, product={}",
                    request == null,
                    request != null ? request.getImportReceipt() == null : "N/A",
                    request != null ? request.getProduct() == null : "N/A");
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Get import_id from request
        log.info("Extracting import ID from request");
        String importId = request.getImportId();
        log.info("Import ID extracted: {}", importId);
        if (importId == null) {
            log.error("Import ID is null");
            throw new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND);
        }

        // Find draft import receipt
        log.info("Fetching import receipt with ID: {} and status: draft", importId);
        ImportReceipt importEntity = importrepo.findById(importId)
                .filter(i -> {
                    log.info("Checking if import receipt status is draft: status={}", i.getStatus());
                    return i.getStatus() == 0;
                })
                .orElseThrow(() -> {
                    log.error("Import receipt not found or not in draft status for ID: {}", importId);
                    return new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND);
                });
        log.info("Found import receipt with ID: {}", importEntity.getImport_id());

        // Get import receipt request details
        log.info("Extracting import receipt request details");
        ImportReceiptRequest importRequest = request.getImportReceipt();
        log.info("Import receipt request details: totalAmount={}, status={}, supplierId={}",
                importRequest.getTotalAmount(), importRequest.getStatus(), importRequest.getSupplierId());

        // Lookup supplier if provided
        Suppliers suppliers = null;
        log.info("Checking if supplier ID is provided: {}", importRequest.getSupplierId());
        if (importRequest.getSupplierId() != null) {
            log.info("Fetching supplier with ID: {}", importRequest.getSupplierId());
            suppliers = suppliersRepository.findById(importRequest.getSupplierId())
                    .orElseThrow(() -> {
                        log.error("Supplier not found for ID: {}", importRequest.getSupplierId());
                        return new AppException(ErrorCode.SUPPLIER_NOT_EXIST);
                    });
            log.info("Found supplier with ID: {}", suppliers.getId());
        } else {
            log.info("No supplier ID provided in the request");
        }

        // Update import receipt entity
        log.info("Updating import receipt entity with new details");
        log.info("Setting total amount: {}", importRequest.getTotalAmount());
        importEntity.setTotalAmount(importRequest.getTotalAmount());
        log.info("Setting status: {}", importRequest.getStatus());
        importEntity.setStatus(importRequest.getStatus());
        log.info("Setting suppliers: {}", suppliers != null ? suppliers.getId() : "null");
        importEntity.setSuppliers(suppliers);

        // Save import receipt
        ImportReceipt savedImportEntity;
        try {
            log.info("Saving import receipt entity to repository");
            savedImportEntity = importrepo.save(importEntity);
            log.info("Successfully saved import receipt with ID: {}", savedImportEntity.getImport_id());
        } catch (StaleObjectStateException e) {
            log.error("Concurrent modification detected for import receipt ID: {}", importId, e);
            throw new AppException(ErrorCode.CONCURRENT_MODIFICATION);
        }

        // Process import receipt details
        log.info("Extracting import receipt details from request");
        List<ImportReceiptDetailsRequest> detailsRequests = request.getProduct();
        log.info("Processing {} import receipt details", detailsRequests.size());
        if (detailsRequests.isEmpty()) {
            log.error("No import receipt details provided");
            throw new AppException(ErrorCode.IMPORT_DETAIL_NOT_EXIST);
        }

        List<ImportReceiptDetailsResponse> savedDetails = new ArrayList<>();
        log.info("Initializing saved details list");
        for (ImportReceiptDetailsRequest detailRequest : detailsRequests) {
            log.info("Processing detail request for productVersionId: {}", detailRequest.getProductVersionId());
            log.info("Setting import ID for detail: {}", savedImportEntity.getImport_id());
            detailRequest.setImport_id(savedImportEntity.getImport_id());

            log.info("Validating detail request: productVersionId={}, quantity={}, unitPrice={}",
                    detailRequest.getProductVersionId(), detailRequest.getQuantity(), detailRequest.getUnitPrice());
            if (detailRequest.getProductVersionId() == null || detailRequest.getQuantity() == null || detailRequest.getUnitPrice() == null) {
                log.error("Invalid detail request: missing productVersionId, quantity, or unitPrice");
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            log.info("Checking if quantity is negative: {}", detailRequest.getQuantity());
            if (detailRequest.getQuantity() < 0) {
                log.error("Invalid quantity: {} for productVersionId: {}", detailRequest.getQuantity(), detailRequest.getProductVersionId());
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            log.info("Creating import receipt detail");
            ImportReceiptDetailsResponse detailResponse = importReceiptDetailsService.createImportReceiptDetails(detailRequest);
            log.info("Adding detail response to saved details list");
            savedDetails.add(detailResponse);
            log.info("Saved import receipt detail for productVersionId: {}", detailRequest.getProductVersionId());

            log.info("Checking if product is non-serialized and has IMEIs: type={}, imeiList={}",
                    detailRequest.getType(), detailRequest.getImei() != null ? detailRequest.getImei().size() : 0);
            if (Boolean.FALSE.equals(detailRequest.getType()) && detailRequest.getImei() != null && !detailRequest.getImei().isEmpty()) {
                log.info("Processing non-serialized IMEIs");
                List<ProductItemRequest> imeiList = detailRequest.getImei();
                int quantity = detailRequest.getQuantity();
                log.info("Non-serialized IMEIs for productVersionId: {}, quantity: {}", detailRequest.getProductVersionId(), quantity);

                log.info("Validating IMEI list size");
                if (imeiList.isEmpty()) {
                    log.error("IMEI list is empty for non-serialized productVersionId: {}", detailRequest.getProductVersionId());
                    throw new AppException(ErrorCode.IMEI_NOT_FOUND);
                }

                log.info("Extracting starting IMEI");
                String startImei = imeiList.get(0).getImei();
                log.info("Starting IMEI: {}", startImei);

                log.info("Validating starting IMEI format");
                try {
                    Long.parseLong(startImei);
                    log.info("Starting IMEI is valid: {}", startImei);
                } catch (NumberFormatException e) {
                    log.error("Invalid IMEI format: {} for productVersionId: {}", startImei, detailRequest.getProductVersionId(), e);
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }

                log.info("Validating quantity: {}", quantity);
                if (quantity <= 0) {
                    log.error("Invalid quantity: {} for productVersionId: {}", quantity, detailRequest.getProductVersionId());
                    throw new AppException(ErrorCode.INVALID_QUANTITY);
                }

                log.info("Validating IMEI list size against quantity: listSize={}, quantity={}", imeiList.size(), quantity);
                if (imeiList.size() > 1 && imeiList.size() != quantity) {
                    log.error("IMEI list size: {} does not match quantity: {} for productVersionId: {}", imeiList.size(), quantity, detailRequest.getProductVersionId());
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }

                log.info("Fetching product version for ID: {}", detailRequest.getProductVersionId());
                ProductVersion version = productVersionRepo.findById(detailRequest.getProductVersionId())
                        .orElseThrow(() -> {
                            log.error("Product version not found for ID: {}", detailRequest.getProductVersionId());
                            return new AppException(ErrorCode.PRODUCT_VERSION_NOT_FOUND);
                        });

                Set<String> imeis = new HashSet<>();
                log.info("Initializing IMEI set for tracking duplicates");
                log.info("Generating product items for {} IMEIs", quantity);

                for (int i = 0; i < quantity; i++) {
                    log.info("Generating IMEI for index: {}", i);
                    String currentImei = String.valueOf(Long.parseLong(startImei) + i);
                    log.info("Generated IMEI: {}", currentImei);

                    log.info("Checking for duplicate IMEI in repository: {}", currentImei);
                    if (productItemRepo.existsById(currentImei)) {
                        log.error("Duplicate IMEI found: {} for productVersionId: {}", currentImei, detailRequest.getProductVersionId());
                        throw new AppException(ErrorCode.IMEI_DUPLICATE);
                    }
                    log.info("Checking for duplicate IMEI in set: {}", currentImei);
                    if (!imeis.add(currentImei)) {
                        log.error("Duplicate IMEI in set: {} for productVersionId: {}", currentImei, detailRequest.getProductVersionId());
                        throw new AppException(ErrorCode.IMEI_DUPLICATE);
                    }

                    log.info("Creating product item request for IMEI: {}", currentImei);
                    ProductItemRequest item = new ProductItemRequest();
                    log.info("Setting IMEI: {}", currentImei);
                    item.setImei(currentImei);
                    log.info("Setting import ID: {}", savedImportEntity.getImport_id());
                    item.setImportId(savedImportEntity.getImport_id());
                    log.info("Setting product version ID: {}", detailRequest.getProductVersionId());
                    item.setProductVersionId(detailRequest.getProductVersionId());

                    log.info("Mapping product item request to entity");
                    ProductItem productItem = productItemMapper.ToProducItemcreate(item, version, savedImportEntity, null);
                    log.info("Saving product item with IMEI: {}", currentImei);
                    productItemRepo.save(productItem);
                    log.info("Saved product item with IMEI: {} for productVersionId: {}", currentImei, detailRequest.getProductVersionId());
                }
            }
            log.info("Checking if product is serialized and has IMEIs: type={}, imeiList={}",
                    detailRequest.getType(), detailRequest.getImei() != null ? detailRequest.getImei().size() : 0);
            if (Boolean.TRUE.equals(detailRequest.getType()) && detailRequest.getImei() != null && !detailRequest.getImei().isEmpty()) {
                log.info("Processing serialized IMEIs");
                List<ProductItemRequest> productItems = detailRequest.getImei();
                log.info("Serialized IMEIs for productVersionId: {}, count: {}", detailRequest.getProductVersionId(), productItems.size());
                Set<String> imeis = new HashSet<>();
                log.info("Initializing IMEI set for tracking duplicates");

                for (ProductItemRequest item : productItems) {
                    log.info("Processing product item with IMEI: {}", item.getImei());
                    log.info("Validating IMEI: {}", item.getImei());
                    if (item.getImei() == null) {
                        log.error("Null IMEI for serialized productVersionId: {}", detailRequest.getProductVersionId());
                        throw new AppException(ErrorCode.IMEI_NOT_FOUND);
                    }
                    log.info("Checking for duplicate IMEI in repository: {}", item.getImei());
                    if (productItemRepo.existsById(item.getImei())) {
                        log.error("Duplicate IMEI found: {} for productVersionId: {}", item.getImei(), detailRequest.getProductVersionId());
                        throw new AppException(ErrorCode.IMEI_NOT_FOUND);
                    }
                    log.info("Checking for duplicate IMEI in set: {}", item.getImei());
                    if (!imeis.add(item.getImei())) {
                        log.error("Duplicate IMEI in set: {} for productVersionId: {}", item.getImei(), detailRequest.getProductVersionId());
                        throw new AppException(ErrorCode.IMEI_NOT_FOUND);
                    }

                    log.info("Setting import ID for product item: {}", savedImportEntity.getImport_id());
                    item.setImportId(savedImportEntity.getImport_id());
                    log.info("Setting product version ID for product item: {}", detailRequest.getProductVersionId());
                    item.setProductVersionId(detailRequest.getProductVersionId());

                    log.info("Fetching product version for ID: {}", item.getProductVersionId());
                    ProductVersion version = productVersionRepo.findById(item.getProductVersionId())
                            .orElseThrow(() -> {
                                log.error("Product version not found for ID: {}", item.getProductVersionId());
                                return new AppException(ErrorCode.PRODUCT_VERSION_NOT_FOUND);
                            });

                    log.info("Mapping product item request to entity");
                    ProductItem productItem = productItemMapper.ToProducItemcreate(item, version, savedImportEntity, null);
                    log.info("Saving product item with IMEI: {}", item.getImei());
                    productItemRepo.save(productItem);
                    log.info("Saved product item with IMEI: {} for productVersionId: {}", item.getImei(), item.getProductVersionId());
                }
                log.info("Validating IMEI list size against quantity: listSize={}, quantity={}", productItems.size(), detailRequest.getQuantity());
                if (productItems.size() != detailRequest.getQuantity()) {
                    log.error("IMEI list size: {} does not match quantity: {} for productVersionId: {}", productItems.size(), detailRequest.getQuantity(), detailRequest.getProductVersionId());
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
            } else if (Boolean.TRUE.equals(detailRequest.getType()) && (detailRequest.getImei() == null || detailRequest.getImei().isEmpty())) {
                log.error("No IMEIs provided for serialized productVersionId: {}", detailRequest.getProductVersionId());
                throw new AppException(ErrorCode.IMEI_NOT_FOUND);
            }
        }

        // Convert to response
        log.info("Converting saved import receipt to response");
        ImportReceiptFULLResponse savedImportReceipt = importmapper.toImportReceiptFULLResponse(savedImportEntity);
        log.info("Setting details in response");
        savedImportReceipt.setDetails(savedDetails);
        log.info("Setting staff name in response: {}", savedImportEntity.getStaff().getUserName());
        savedImportReceipt.setStaffName(savedImportEntity.getStaff().getUserName());
        log.info("Setting supplier name in response: {}", suppliers != null ? suppliers.getName() : "null");
        savedImportReceipt.setSupplierName(suppliers != null ? suppliers.getName() : null);
        log.info("Successfully created import receipt with ID: {}", savedImportEntity.getImport_id());

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
