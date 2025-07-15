package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.ImportReceiptDetailsRequest;
import com.app.product_warehourse.dto.request.ImportReceiptDetailsUpdateRequest;
import com.app.product_warehourse.dto.response.ImportReceiptDetailsResponse;
import com.app.product_warehourse.entity.ImportReceipt;
import com.app.product_warehourse.entity.ImportReceiptDetail;
import com.app.product_warehourse.entity.ProductVersion;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.ImportReceiptDetailsMapper;
import com.app.product_warehourse.repository.ImportReceiptDetailsRespository;
import com.app.product_warehourse.repository.ImportReceiptRepository;
import com.app.product_warehourse.repository.ProductVersionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.List;


@Service
@RequiredArgsConstructor  // thay cho autowrid
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
public class ImportReceiptDetailsService {


            ImportReceiptDetailsRespository importDrepo;
            ImportReceiptDetailsMapper importDmapper;

            ImportReceiptRepository importRepo; // Thay thế ImportReceiptService
            ProductVersionRepository productVersionRepo;


    public ImportReceiptDetailsResponse createImportReceiptDetails(ImportReceiptDetailsRequest request) {
        // Xác thực đầu vào
        if (request.getImport_id() == null || request.getProductVersionId() == null) {
            throw new IllegalArgumentException("ID của ImportReceipt và ProductVersion không được để trống");
        }

        // Kiểm tra xem bản ghi đã tồn tại chưa
        ImportReceiptDetail.ImportReceiptDetailId compositeId = new ImportReceiptDetail.ImportReceiptDetailId();

        // Lấy thực thể ImportReceipt và ProductVersion
        ImportReceipt importReceipt = importRepo.findById(request.getImport_id())
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));

        ProductVersion productVersion = productVersionRepo.findById(request.getProductVersionId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VERSION_NOT_FOUND));

        compositeId.setImport_id(importReceipt);
        compositeId.setProductVersionId(productVersion);

        if (importDrepo.existsById(compositeId)) {
            throw new AppException(ErrorCode.IMPORT_RECEIPT_DETAIL_ALREADY_EXISTS);
        }

        if (importReceipt == null || productVersion == null) {
            throw new IllegalArgumentException("Không tìm thấy ImportReceipt hoặc ProductVersion với ID được cung cấp");
        }

        // Ánh xạ request sang ImportReceiptDetail
        ImportReceiptDetail detail = importDmapper.toImportReceiptDetails(request, importReceipt, productVersion);

        // Thiết lập khóa phức hợp thủ công
        detail.setNewid(compositeId);

        // Lưu thực thể
        ImportReceiptDetail savedDetail = importDrepo.save(detail);

        // Ánh xạ sang response
        ImportReceiptDetailsResponse response = importDmapper.toImportReceiptDetailsResponse(savedDetail);

        return response;
    }



    public List<ImportReceiptDetailsResponse> getAllImportReceiptDetails() {
        List<ImportReceiptDetail> response = importDrepo.findAll();
        return response
                .stream()
                .map(importDmapper ::toImportReceiptDetailsResponse)
                .collect(Collectors.toList());
    }


    public ImportReceiptDetail getImportReceiptDetails( String id , String productVersionId) {
        // Xác thực đầu vào
        if (id == null || productVersionId == null) {
            throw new IllegalArgumentException("ID của ImportReceipt và ProductVersion không được để trống");
        }
         ImportReceiptDetail response = importDrepo.findByImportIdAndProductVersionId(id,productVersionId);
        if (response == null) {
            throw new IllegalArgumentException("Không tìm thấy ImportReceiptDetail với importId: " + id + " và productVersionId: " + productVersionId);
        }
        return response;
    }


    public ImportReceiptDetailsResponse  UpdateImportReceiptDetails(ImportReceiptDetailsUpdateRequest request, String id , String productVersionId) {
        ImportReceiptDetail importDetails = getImportReceiptDetails(id,productVersionId);
        if (importDetails == null) {
            throw new AppException(ErrorCode.IMPORT_DETAIL_NOT_EXIST);
        }
        importDmapper.toUpdateImportDetail(request,importDetails);
        ImportReceiptDetail savedDetail = importDrepo.save(importDetails);
        return importDmapper.toImportReceiptDetailsResponse(savedDetail);
    }


    public void deleteImportReceiptDetails( String id , String productVersionId) {
        ImportReceiptDetail importDetails = getImportReceiptDetails(id,productVersionId);
        if (importDetails == null) {
            throw new AppException(ErrorCode.IMPORT_DETAIL_NOT_EXIST);
        }
        importDrepo.deleteByImportIdAndProductVersionId(id,productVersionId);
    }



}
