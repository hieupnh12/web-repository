package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.SupplierRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.SupplierResponse;
import com.app.product_warehourse.entity.Suppliers;
import com.app.product_warehourse.service.SupplierService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/supplier")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SupplierController {

            SupplierService supplierService;


            @PostMapping
            public ApiResponse<Suppliers> AddSupplier(@RequestBody @Valid SupplierRequest request) {
                ApiResponse<Suppliers> resp = new ApiResponse<>();
                resp.setResult(supplierService.createSuppliers(request));

                return resp;
            }


           @PutMapping("/{id}")
           public ApiResponse<SupplierResponse> UpdateSupplier(@PathVariable String id, @RequestBody @Valid SupplierRequest request) {
                ApiResponse<SupplierResponse> resp = new ApiResponse<>();
                resp.setResult(supplierService.updateSupplier(id, request));
                return resp;
           }

           @DeleteMapping("/{id}")
           public ApiResponse<Void> DeleteSupplier(@PathVariable String id) {
               supplierService.deleteSupplier(id);
               return new ApiResponse<>(2020,"successfully deleted Supplier ",null);
           }


            @GetMapping
          public ApiResponse<List<SupplierResponse>> getSuppliers() {
                ApiResponse<List<SupplierResponse>> resp = new ApiResponse<>();
                resp.setResult(supplierService.getAllSupplier());
                return resp;
            }



}
