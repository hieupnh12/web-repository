package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.*;
import com.app.product_warehourse.dto.response.*;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.ExportReceiptMapper;
import com.app.product_warehourse.mapper.ProductItemMapper;
import com.app.product_warehourse.repository.CustomerRepository;
import com.app.product_warehourse.repository.ExportReceiptRepository;
import com.app.product_warehourse.repository.ProductItemRepository;
import com.app.product_warehourse.repository.ProductVersionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.StaleObjectStateException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.orm.hibernate5.HibernateOptimisticLockingFailureException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ExportReceiptService {

    ExportReceiptRepository repo;
    ExportReceiptMapper exportMapper;

    ExportReceiptDetailService exportReceiptDetailService;
    AccountService accountService;
    CustomerService customerService;
    CustomerRepository customerRepository;
    ProductVersionRepository productVersionRepo;
    ProductItemRepository productItemRepo;
    ProductItemMapper productItemMapper;



    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')") // Giữ nếu vẫn sử dụng Spring Security, nếu không thì xóa
    public ExportReceiptFULLResponse initExportReceipt(ExportReceiptFullRequest request) {
        log.info("Creating import receipt with request: {}", request);


        // Validate account
        Account account = accountService.getAccountEntity(request.getExportReceipt().getStaffId());
        if (account == null) {
            log.error("Account not found: {}",request.getExportReceipt().getStaffId());
            throw new AppException(ErrorCode.ACCOUNT_NOT_EXIST);
        }
        Customer customer = customerService.getCustomer(request.getExportReceipt().getCustomerId());
        if (customer == null) {
            log.error("customernot found: {}",request.getExportReceipt().getCustomerId());
            throw new AppException(ErrorCode.CUSTOMER_NOT_EXIST);
        }
        // Create and save import receipt
        ExportReceipt exportReceipt = exportMapper.toExportReceiptToconnect(request.getExportReceipt(),account,customer);
        ExportReceipt savedReceipt = repo.save(exportReceipt);

        // Map to response DTO
        return  exportMapper.toExportreceiptFULLResponse(savedReceipt);
    }





    public ExportReceipt CreateExportReceipt(ExportReceiptRequest request){
        try {
            Account account = accountService.getAccountEntity(request.getStaffId());
            Customer customer = customerService.getCustomer(request.getCustomerId());
            ExportReceipt exportReceipt = exportMapper.toExportReceiptToconnect(request, account, customer);
            return repo.save(exportReceipt);
        } catch (Exception e) {
            log.error("Error creating export receipt: {}", e.getMessage());
            throw new RuntimeException("Failed to create export receipt: " + e.getMessage());
        }
    }



    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ExportReceiptFULLResponse createImportReceiptFull(ExportReceiptFullRequest request) {
        // Khởi tạo logger
        Logger logger = LoggerFactory.getLogger(ExportReceiptService.class);

        // Kiểm tra request hợp lệ
        logger.info("Received ExportReceiptFullRequest: {}", request);
        if (request == null || request.getExportReceipt() == null || request.getProduct() == null) {
            logger.error("Invalid request: request or its components are null");
            throw new AppException(ErrorCode.REQUEST_FIRST_NOT_FOUND);
        }

        // Lấy export_id từ request
        String exportId = request.getExportId();
        logger.info("Export ID: {}", exportId);
        if (exportId == null) {
            logger.error("Export ID is null");
            throw new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND);
        }

        // Tìm phiếu xuất draft
        logger.info("Fetching ExportReceipt with ID: {}", exportId);
        ExportReceipt exportEntity = repo.findById(exportId)
                .filter(i -> i.getStatus() == 0) // Chỉ cho phép cập nhật nếu trạng thái là draft
                .orElseThrow(() -> {
                    logger.error("ExportReceipt with ID {} not found or not in draft status", exportId);
                    return new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND);
                });
        logger.info("Found ExportReceipt: {}", exportEntity);

        // Lấy thông tin từ ExportReceiptRequest
        ExportReceiptRequest exportRequest = request.getExportReceipt();
        logger.info("ExportReceiptRequest: {}", exportRequest);

        // Tra cứu Customer (nếu có)
        Customer customer = null;
        String customerId = exportRequest.getCustomerId();
        logger.info("Customer ID: {}", customerId);
        if (customerId != null) {
            logger.info("Fetching Customer with ID: {}", customerId);
            customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> {
                        logger.error("Customer with ID {} not found", customerId);
                        return new AppException(ErrorCode.CUSTOMER_NOT_EXIST);
                    });
            logger.info("Found Customer: {}", customer);
        } else {
            logger.warn("Customer ID is null, proceeding without customer");
        }

        // Cập nhật thông tin phiếu xuất
        logger.info("Updating ExportReceipt with totalAmount: {}, status: {}, customer: {}",
                exportRequest.getTotalAmount(), exportRequest.getStatus(), customer);
        exportEntity.setTotalAmount(exportRequest.getTotalAmount());
        exportEntity.setStatus(exportRequest.getStatus());
        exportEntity.setCustomer(customer);

        // Lưu bản ghi và xử lý lỗi StaleObjectStateException
        ExportReceipt savedExportEntity;
        try {
            logger.info("Saving ExportReceipt: {}", exportEntity);
            savedExportEntity = repo.save(exportEntity);
            logger.info("Saved ExportReceipt: {}", savedExportEntity);
        } catch (HibernateOptimisticLockingFailureException e) {
            logger.error("Concurrent modification detected for ExportReceipt ID: {}", exportId, e);
            throw new AppException(ErrorCode.CONCURRENT_MODIFICATION);
        }

        // Xử lý chi tiết phiếu xuất
        List<ExportReceiptDetailsRequest> detailsRequests = request.getProduct();
        logger.info("Processing {} ExportReceiptDetailsRequest", detailsRequests.size());
        if (detailsRequests.isEmpty()) {
            logger.error("No ExportReceiptDetails found");
            throw new AppException(ErrorCode.EXPORT_DETAIL_NOT_FOUND);
        }

        List<ExportReceiptDetailsResponse> savedDetails = new ArrayList<>();
        for (ExportReceiptDetailsRequest detailRequest : detailsRequests) {
            detailRequest.setExport_id(savedExportEntity.getExport_id());
            logger.info("Processing ExportReceiptDetailsRequest: {}", detailRequest);

            if (detailRequest.getQuantity() == null || detailRequest.getUnitPrice() == null) {
                logger.error("Invalid detail request: quantity or unitPrice is null");
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            if (detailRequest.getQuantity() < 0) {
                logger.error("Invalid detail request: quantity is negative");
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            // Xử lý ProductItem và lấy IMEI, productVersionId
            List<ProductItemRequest> productItems = detailRequest.getImei();
            logger.info("Processing {} ProductItems", productItems != null ? productItems.size() : 0);
            if (productItems == null || productItems.isEmpty()) {
                logger.error("No ProductItems found in detail request");
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            Set<String> imeis = new HashSet<>();
            List<String> imeiList = new ArrayList<>();
            for (ProductItemRequest item : productItems) {
                logger.info("Processing ProductItem: {}", item);
                if (item.getImei() == null || !imeis.add(item.getImei())) {
                    logger.error("Invalid ProductItem: IMEI is null or duplicate");
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
                item.setExportId(savedExportEntity.getExport_id());

                // Kiểm tra ProductVersion
                logger.info("Fetching ProductVersion with ID: {}", item.getProductVersionId());
                ProductVersion version = productVersionRepo.findById(item.getProductVersionId())
                        .orElseThrow(() -> {
                            logger.error("ProductVersion with ID {} not found", item.getProductVersionId());
                            return new AppException(ErrorCode.PRODUCT_VERSION_NOT_FOUND);
                        });
                logger.info("Found ProductVersion: {}", version);

                // Tạo ExportReceiptDetails với productVersionId và imei từ ProductItem
                ExportReceiptDetailsRequest updatedDetailRequest = new ExportReceiptDetailsRequest();
                updatedDetailRequest.setExport_id(savedExportEntity.getExport_id());
                updatedDetailRequest.setProductVersionId(item.getProductVersionId());
                updatedDetailRequest.setImei(Collections.singletonList(item));
                updatedDetailRequest.setQuantity(1);
                updatedDetailRequest.setUnitPrice(detailRequest.getUnitPrice());
                logger.info("Created updatedDetailRequest: {}", updatedDetailRequest);

                // Lưu ExportReceiptDetails
                logger.info("Saving ExportReceiptDetails");
                ExportReceiptDetailsResponse detailResponse = exportReceiptDetailService.CreateExportReceiptDetails(updatedDetailRequest);
                logger.info("Saved ExportReceiptDetailsResponse: {}", detailResponse);
                savedDetails.add(detailResponse);

                // Thu thập IMEI để cập nhật exportId
                imeiList.add(item.getImei());
            }

            // Kiểm tra số lượng ProductItems có khớp với quantity trong detailRequest
            if (productItems.size() != detailRequest.getQuantity()) {
                logger.error("Mismatch between ProductItems size ({}) and quantity ({})",
                        productItems.size(), detailRequest.getQuantity());
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            // Cập nhật exportId trong ProductItem
            logger.info("Updating ProductItems with exportId: {} for IMEIs: {}", savedExportEntity.getExport_id(), imeiList);
            productItemRepo.updateExportIdByImei(savedExportEntity.getExport_id(), imeiList);
            logger.info("Updated ProductItems successfully");
        }

        // Chuyển đổi sang ExportReceiptFULLResponse với details
        logger.info("Mapping to ExportReceiptFULLResponse");
        ExportReceiptFULLResponse savedExportReceipt = exportMapper.toExportreceiptFULLResponse(savedExportEntity);
        savedExportReceipt.setDetails(savedDetails);
        savedExportReceipt.setStaffName(savedExportEntity.getStaff().getUserName());
        savedExportReceipt.setCustomerName(customer != null ? customer.getCustomerName() : null);
        logger.info("Final ExportReceiptFULLResponse: {}", savedExportReceipt);

        return savedExportReceipt;
    }















    public List<ExportReceiptResponse> GetAllExportReceipt(){
        List<ExportReceiptResponse> exp = repo.findAll()
                .stream()
                .map(exportMapper :: toexportreceiptResponse)
                .collect(Collectors.toList());
        return exp;
    }


    public void deleteExportReceipt(String id) {
        var exportReceipt = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Export receipt not found"));
        repo.deleteById(id);
    }




    public ExportReceipt getExportreceipt(String id) {
        return repo.findById(id).orElseThrow(()-> new RuntimeException("export_receipt not found"));
    }
}
