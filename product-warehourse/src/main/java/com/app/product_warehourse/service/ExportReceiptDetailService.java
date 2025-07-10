package com.app.product_warehourse.service;



import com.app.product_warehourse.dto.request.ExportReceiptDetailUpdateRequest;
import com.app.product_warehourse.dto.request.ExportReceiptDetailsRequest;
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


           // Lấy ProductItem từ item_id (giả sử productVersionId trong request là item_id)
           ProductItem item = productItemRepo.findById(String.valueOf(request.getImei())).orElseThrow(()->new AppException(ErrorCode.PRODUCT_ITEM_NOT_FOUND));

           ExportReceipt exportReceipt = exportReceiptRepo.findById(request.getExport_id()).orElseThrow(()->new AppException(ErrorCode.EXPORT_RECEIPT_NOT_FOUND));

           ExportReceiptDetail response = exDMapper.toExportDetails(request,item,exportReceipt);

           ExportReceiptDetail.ExportReceiptDetailId id = exDMapper.ExportReceiptToConnect(request,item,exportReceipt);
           response.setNewExId(id);


           ExportReceiptDetail complete = exDRepo.save(response);
           return exDMapper.toExportDetailsResponse(complete);

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
