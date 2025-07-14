package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.*;
import com.app.product_warehourse.dto.response.*;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.ExportReceiptMapper;
import com.app.product_warehourse.mapper.ProductItemMapper;
import com.app.product_warehourse.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.StaleObjectStateException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.orm.hibernate5.HibernateOptimisticLockingFailureException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ExportReceiptService {

    ExportReceiptRepository repo;
    ExportReceiptMapper exportMapper;

    AccountRepository accountRepository;
    ExportReceiptDetailService exportReceiptDetailService;
    AccountService accountService;
    CustomerService customerService;
    CustomerRepository customerRepository;
    ProductVersionRepository productVersionRepo;
    ProductItemRepository productItemRepo;
    ProductItemMapper productItemMapper;



    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')") // Giữ nếu vẫn sử dụng Spring Security, nếu không thì xóa
    public ExportReceiptFULLResponse initExportReceipt(ExportReceiptFullRequest request) {


        // Validate account
        var context =  SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account  =  accountRepository.findByUserName(name).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

        // Create and save import receipt
        ExportReceipt exportReceipt = exportMapper.toExportReceiptToconnect(request.getExportReceipt(),account,null);
        ExportReceipt savedReceipt = repo.save(exportReceipt);

        // Map to response DTO
        return  exportMapper.toExportreceiptFULLResponse(savedReceipt);
    }





    public ExportReceipt CreateExportReceipt(ExportReceiptRequest request){
        try {
            var context =  SecurityContextHolder.getContext();
            String name = context.getAuthentication().getName();

            Account account  =  accountRepository.findByUserName(name).orElseThrow(
                    () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));

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
        if (request == null || request.getExportReceipt() == null || request.getProduct() == null) {
            throw new AppException(ErrorCode.REQUEST_FIRST_NOT_FOUND);
        }

        String exportId = request.getExportId();
        if (exportId == null) {
            throw new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND);
        }

        ExportReceipt exportEntity = repo.findById(exportId)
                .filter(i -> i.getStatus() == 0)
                .orElseThrow(() -> new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND));

        ExportReceiptRequest exportRequest = request.getExportReceipt();

        Customer customer = null;
        String customerId = exportRequest.getCustomerId();
        if (customerId != null) {
            customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_EXIST));
        }

        exportEntity.setTotalAmount(exportRequest.getTotalAmount());
        exportEntity.setStatus(exportRequest.getStatus());
        exportEntity.setCustomer(customer);

        ExportReceipt savedExportEntity;
        try {
            savedExportEntity = repo.save(exportEntity);
        } catch (HibernateOptimisticLockingFailureException e) {
            throw new AppException(ErrorCode.CONCURRENT_MODIFICATION);
        }

        List<ExportReceiptDetailsRequest> detailsRequests = request.getProduct();
        if (detailsRequests.isEmpty()) {
            throw new AppException(ErrorCode.EXPORT_DETAIL_NOT_FOUND);
        }

        List<ExportReceiptDetailsResponse> savedDetails = new ArrayList<>();
        for (ExportReceiptDetailsRequest detailRequest : detailsRequests) {
            detailRequest.setExport_id(savedExportEntity.getExport_id());

            if (detailRequest.getQuantity() == null || detailRequest.getUnitPrice() == null) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            if (detailRequest.getQuantity() < 0) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            List<ProductItemRequest> productItems = detailRequest.getImei();
            if (productItems == null || productItems.isEmpty()) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            Set<String> imeis = new HashSet<>();
            List<String> imeiList = new ArrayList<>();
            for (ProductItemRequest item : productItems) {
                if (item.getImei() == null || !imeis.add(item.getImei())) {
                    throw new AppException(ErrorCode.INVALID_REQUEST);
                }
                item.setExportId(savedExportEntity.getExport_id());

                ProductVersion version = productVersionRepo.findById(item.getProductVersionId())
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VERSION_NOT_FOUND));

                ExportReceiptDetailsRequest updatedDetailRequest = new ExportReceiptDetailsRequest();
                updatedDetailRequest.setExport_id(savedExportEntity.getExport_id());
                updatedDetailRequest.setProductVersionId(item.getProductVersionId());
                updatedDetailRequest.setImei(Collections.singletonList(item));
                updatedDetailRequest.setQuantity(1);
                updatedDetailRequest.setUnitPrice(detailRequest.getUnitPrice());

                ExportReceiptDetailsResponse detailResponse = exportReceiptDetailService.CreateExportReceiptDetails(updatedDetailRequest);
                savedDetails.add(detailResponse);

                imeiList.add(item.getImei());
            }

            if (productItems.size() != detailRequest.getQuantity()) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            productItemRepo.updateExportIdByImei(savedExportEntity.getExport_id(), imeiList);
        }

        ExportReceiptFULLResponse savedExportReceipt = exportMapper.toExportreceiptFULLResponse(savedExportEntity);
        savedExportReceipt.setDetails(savedDetails);
        savedExportReceipt.setStaffName(savedExportEntity.getStaff().getUserName());
        savedExportReceipt.setCustomerName(customer != null ? customer.getCustomerName() : null);

        return savedExportReceipt;
    }













    public Page<ExportReceiptFULLResponse> GetAllExportReceipt(Pageable pageable){
        return repo.findAll(pageable)
                .map(exportMapper::toExportreceiptFULLResponse);

    }

//
//    public void deleteExportReceipt(String id) {
//        var exportReceipt = repo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Export receipt not found"));
//        repo.deleteById(id);
//    }




    public ExportReceipt getExportreceipt(String id) {
        return repo.findById(id).orElseThrow(()-> new RuntimeException("export_receipt not found"));
    }


    public Page<ExportReceiptFULLResponse> searchExportReceipts(
            String customerName,
            String staffName,
            String exportId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {
        return repo.searchExportReceipts(
                        customerName, staffName, exportId, startDate, endDate, pageable)
                .map(exportMapper::toExportreceiptFULLResponse);
    }


    @Transactional
    public void deleteExportReceipt(String exportId) {

        if (repo.existsById(exportId)) {

            // Đặt export_id trong ProductItem thành null
            repo.resetExportIdByExportId(exportId);

            // Xóa các ExportReceiptDetail liên quan
             repo.deleteDetailsByExportId(exportId);

            // Xóa ExportReceipt
            repo.deleteByExportId(exportId);

        } else {
            throw new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND);
        }
    }


}
