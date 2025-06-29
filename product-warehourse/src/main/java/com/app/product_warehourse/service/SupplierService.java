package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.SupplierRequest;
import com.app.product_warehourse.dto.response.SupplierResponse;
import com.app.product_warehourse.entity.Suppliers;
import com.app.product_warehourse.mapper.SupplierMapper;
import com.app.product_warehourse.repository.SupplierRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor  // thay cho autowrid
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
public class SupplierService {

    SupplierRepository supplierRepo;
    SupplierMapper supplierMap;


    public Suppliers createSuppliers(SupplierRequest request){
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
            List<Suppliers> suppliers = supplierRepo.findAll();
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


}
