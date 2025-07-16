package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.SupplierRequest;
import com.app.product_warehourse.dto.response.CustomerResponse;
import com.app.product_warehourse.dto.response.SupplierResponse;
import com.app.product_warehourse.entity.Suppliers;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.SupplierMapper;
import com.app.product_warehourse.repository.SuppliersRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor  // thay cho autowrid
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
public class SupplierService {

    SuppliersRepository supplierRepo;
    SupplierMapper supplierMap;

    @PreAuthorize("hasRole('ADMIN') or hasAuthority('Suppliers_CREATE')")
    public Suppliers createSuppliers(SupplierRequest request){
        if (supplierRepo.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.PHONE_NUMBER_AVAILABLE);
        }
             Suppliers suppliers = Suppliers.builder()
                     .name(request.getName())
                     .email(request.getEmail())
                     .phone(request.getPhone())
                     .address(request.getAddress())
                     .status(request.getStatus())
                     .build();

             return supplierRepo.save(suppliers);
    }



    public List<SupplierResponse> getAllSupplier(){
            List<Suppliers> suppliers = supplierRepo.findByStatusTrue();
          return  suppliers.stream()
                  .map(supplierMap ::toSupplierResponse)
                  .collect(Collectors.toList());

    }



    public Suppliers getSupplier(String id){
        return supplierRepo.findById(id).orElseThrow(() ->  new RuntimeException("Not Found Supplier by Id") );
    }


    public SupplierResponse updateSupplier(String id, SupplierRequest request){
         Suppliers supplier = supplierRepo.findById(id).orElseThrow(() ->  new RuntimeException("Not Found Supplier by Id") );
         supplierMap.updateSupplierFromRequest(request, supplier);

      return   supplierMap.toSupplierResponse(supplierRepo.save(supplier));
    }


    public void deleteSupplier(String id){
        supplierRepo.deleteById(id);
    }


    public Page<SupplierResponse> getAllSupplierPage(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "joinDate"));
        return supplierRepo.findAll(pageable)
                .map(supplierMap::toSupplierResponse);
    }

    public Page<SupplierResponse> searchSuppliers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "joinDate"));
        return supplierRepo
                .findByNameContainingIgnoreCaseOrAddressContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                        keyword, keyword, keyword, keyword, pageable)
                .map(supplierMap::toSupplierResponse);
    }


}
