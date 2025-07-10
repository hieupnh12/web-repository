package com.app.product_warehourse.service;



import com.app.product_warehourse.dto.request.ExportReceiptDetailUpdateRequest;
import com.app.product_warehourse.dto.request.ExportReceiptDetailsRequest;
import com.app.product_warehourse.dto.request.ProductItemRequest;
import com.app.product_warehourse.dto.response.ExportReceiptDetailsResponse;
import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.entity.ExportReceiptDetail;
import com.app.product_warehourse.entity.ProductItem;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.ExportReceiptDetailMapper;
import com.app.product_warehourse.repository.ExportReceiptDetailsRepository;
import com.app.product_warehourse.repository.ExportReceiptRepository;
import com.app.product_warehourse.repository.ProductItemRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor  // thay cho autowrid
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
public class ExportReceiptDetailService {

       ExportReceiptDetailMapper exDMapper;
       ExportReceiptDetailsRepository exDRepo;

       ProductItemRepository productItemRepo;

       ExportReceiptRepository exportReceiptRepo;

    public ExportReceiptDetailsResponse CreateExportReceiptDetails(ExportReceiptDetailsRequest request) {
        // Log đầu vào
        log.info("Processing CreateExportReceiptDetails with request: {}", request);

        // Kiểm tra đầu vào
        if (request == null || request.getExport_id() == null || request.getImei() == null || request.getImei().isEmpty()) {
            log.error("Invalid request: export_id or imei list is null or empty");
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            log.error("Invalid quantity: {}", request.getQuantity());
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        if (request.getUnitPrice() == null || request.getUnitPrice() <= 0) {
            log.error("Invalid unitPrice: {}", request.getUnitPrice());
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Kiểm tra ExportReceipt
        log.info("Fetching ExportReceipt with ID: {}", request.getExport_id());
        ExportReceipt exportReceipt = exportReceiptRepo.findById(request.getExport_id())
                .orElseThrow(() -> {
                    log.error("ExportReceipt with ID {} not found", request.getExport_id());
                    return new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND);
                });

        // Kiểm tra số lượng IMEI khớp với quantity
        List<ProductItemRequest> imeis = request.getImei();
        if (imeis.size() != request.getQuantity()) {
            log.error("Mismatch between IMEI list size ({}) and quantity ({})", imeis.size(), request.getQuantity());
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Kiểm tra và xử lý từng ProductItem
        for (ProductItemRequest itemRequest : imeis) {
            String imei = itemRequest.getImei();
            log.info("Checking ProductItem with IMEI: {}", imei);
            if (imei == null || imei.isEmpty()) {
                log.error("Invalid IMEI: null or empty");
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            // Kiểm tra ProductItem tồn tại
            ProductItem item = productItemRepo.findById(imei)
                    .orElseThrow(() -> {
                        log.error("ProductItem with IMEI {} not found", imei);
                        return new AppException(ErrorCode.PRODUCT_ITEM_NOT_FOUND);
                    });

            // Kiểm tra productVersionId khớp
            if (!item.getVersionId().getVersionId().equals(request.getProductVersionId())) {
                log.error("ProductItem with IMEI {} has productVersionId {} that does not match request productVersionId {}",
                        imei, item.getVersionId(), request.getProductVersionId());
                throw new AppException(ErrorCode.NOT_SAME_VERSION);
            }

            // Tạo ExportReceiptDetail cho từng ProductItem
            ExportReceiptDetail detail = exDMapper.toExportDetails(request, item, exportReceipt);
            ExportReceiptDetail.ExportReceiptDetailId id = exDMapper.ExportReceiptToConnect(request, item, exportReceipt);
            detail.setNewExId(id);

            // Lưu ExportReceiptDetail
            log.info("Saving ExportReceiptDetail for IMEI: {}", imei);
            ExportReceiptDetail savedDetail = exDRepo.save(detail);
            log.info("Saved ExportReceiptDetail: {}", savedDetail);

            // Trả về response cho chi tiết đầu tiên (có thể điều chỉnh để trả về danh sách nếu cần)
            return exDMapper.toExportDetailsResponse(savedDetail);
        }

        // Nếu không có chi tiết nào được lưu (trường hợp không mong muốn)
        log.error("No ExportReceiptDetail was created");
        throw new AppException(ErrorCode.INVALID_REQUEST);
    }



       public List<ExportReceiptDetailsResponse> GetAllExportReceiptDetails() {
           return exDRepo.findAll()
                   .stream()
                   .map(exDMapper::toExportDetailsResponse)
                   .collect(Collectors.toList());
       }



      public ExportReceiptDetail getExportReceiptDetailById(String export_id ,String productVersionId){
          // Xác thực đầu vào
          if (export_id == null | productVersionId == null) {
              throw new IllegalArgumentException("ID của ExportReceipt và Item_id không được để trống");
          }
           ExportReceiptDetail response= exDRepo.findByExportIdAndProductVersionId(export_id,productVersionId);
          if (response == null) {
              throw new IllegalArgumentException("Không tìm thấy  exportId: " + export_id + " và item_id: " + productVersionId);
          }
          return response;
      }


      public ExportReceiptDetailsResponse UpdateExportReceiptDetail(ExportReceiptDetailUpdateRequest request, String export_id , String productVersionId ){
           ExportReceiptDetail response= getExportReceiptDetailById(export_id,productVersionId);
          if (response == null) {
              throw new IllegalArgumentException("Không tìm thấy  exportId: " + export_id + " và item_id: " + productVersionId);
          }
          exDMapper.toUpdateExportDetail(request,response);
          ExportReceiptDetail complete = exDRepo.save(response);
          return exDMapper.toExportDetailsResponse(complete);
      }



      public void DeleteExportReceiptDetail(String export_id , String productVersionId ){
          ExportReceiptDetail response= getExportReceiptDetailById(export_id,productVersionId);
          if (response == null) {
              throw new IllegalArgumentException("Không tìm thấy  exportId: " + export_id + " và item_id: " + productVersionId);
          }
          exDRepo.delete(response);
      }

}
