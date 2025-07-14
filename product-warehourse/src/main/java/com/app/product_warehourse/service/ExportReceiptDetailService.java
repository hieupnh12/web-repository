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
import org.springframework.transaction.annotation.Transactional;

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
        if (request == null || request.getExport_id() == null || request.getImei() == null || request.getImei().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        if (request.getUnitPrice() == null || request.getUnitPrice() <= 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        ExportReceipt exportReceipt = exportReceiptRepo.findById(request.getExport_id())
                .orElseThrow(() -> new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND));

        // Tìm và kiểm tra danh sách ProductItem
        List<ProductItemRequest> imeis = request.getImei();
        if (imeis.size() != request.getQuantity()) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        for (ProductItemRequest itemRequest : imeis) {
            String imei = itemRequest.getImei();
            if (imei == null || imei.isEmpty()) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            ProductItem item = productItemRepo.findById(imei)
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_ITEM_NOT_FOUND));
            if (!item.getVersionId().getVersionId().equals(request.getProductVersionId())) {
                throw new AppException(ErrorCode.NOT_SAME_VERSION);
            }
            ExportReceiptDetail detail = exDMapper.toExportDetails(request, item, exportReceipt);
            ExportReceiptDetail.ExportReceiptDetailId id = exDMapper.ExportReceiptToConnect(request, item, exportReceipt);
            detail.setNewExId(id);
            ExportReceiptDetail savedDetail = exDRepo.save(detail);
            return exDMapper.toExportDetailsResponse(savedDetail);
        }
        throw new AppException(ErrorCode.INVALID_REQUEST);
    }



       public List<ExportReceiptDetailsResponse> GetAllExportReceiptDetails() {
           return  exDRepo.findAll()
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


      @Transactional
      public ExportReceiptDetailsResponse UpdateExportReceiptDetail(ExportReceiptDetailUpdateRequest request, String export_id , String productVersionId ){
           ExportReceiptDetail response= getExportReceiptDetailById(export_id,productVersionId);
          if (response == null) {
              throw new IllegalArgumentException("Không tìm thấy  exportId: " + export_id + " và item_id: " + productVersionId);
          }
          exDMapper.toUpdateExportDetail(request,response);
          ExportReceiptDetail complete = exDRepo.save(response);
          return exDMapper.toExportDetailsResponse(complete);
      }


      @Transactional
      public void DeleteExportReceiptDetail(String export_id , String productVersionId ){
          ExportReceiptDetail response= getExportReceiptDetailById(export_id,productVersionId);
          if (response == null) {
              throw new IllegalArgumentException("Không tìm thấy  exportId: " + export_id + " và item_id: " + productVersionId);
          }
          exDRepo.deleteByExportIdAndItemId(export_id,productVersionId);
      }

}
