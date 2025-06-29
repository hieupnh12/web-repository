package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ExportReceiptRequest;
import com.app.product_warehourse.dto.response.ExportReceiptResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Customer;
import com.app.product_warehourse.entity.ExportReceipt;
import com.app.product_warehourse.mapper.ExportReceiptMapper;
import com.app.product_warehourse.repository.ExportReceiptRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ExportReceiptService {

    ExportReceiptRepository repo;
    ExportReceiptMapper exportMapper;

    AccountService accountService;
    CustomerService customerService;


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
