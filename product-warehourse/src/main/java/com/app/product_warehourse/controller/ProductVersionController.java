package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ProductVersionRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ProductVersionResponse;
import com.app.product_warehourse.service.ProductVersionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productVersion")
public class ProductVersionController {

    @Autowired
    ProductVersionService pvs;

//      @PostMapping
//      ApiResponse<ProductVersionResponse> create(@PathVariable Long id, @RequestBody @Valid ProductVersionRequest request) {
//          ApiResponse<ProductVersionResponse> resp = new ApiResponse<>();
//          resp.setResult(pvs.CreateProductVersion(id,request));
//          return resp;
//
//      }

    @PostMapping
    ApiResponse<ProductVersionResponse> create( @RequestBody @Valid ProductVersionRequest request) {
        ApiResponse<ProductVersionResponse> resp = new ApiResponse<>();
        resp.setResult(pvs.CreateProductVersion(request));
        return resp;
    }






      @GetMapping
      ApiResponse<List<ProductVersionResponse>> getAll() {
           ApiResponse<List<ProductVersionResponse>> resp = new ApiResponse<>();
           resp.setCode(1010);
           resp.setResult(pvs.ListProductVersion());
           return resp;
      }


      @PutMapping("/{id}")
      ApiResponse<ProductVersionResponse> update(@PathVariable String id, @RequestBody @Valid ProductVersionRequest request) {
          ApiResponse<ProductVersionResponse> resp = new ApiResponse<>();
          resp.setCode(1011);
          resp.setMessage("Product version update successful");
          resp.setResult(pvs.UpdateProductVersion(request,id));
          return resp;
      }


      @DeleteMapping("/{id}")
    ApiResponse<Void> delete(@PathVariable String id) {
          pvs.DeleteProductVersion(id);
          ApiResponse<Void> resp = new ApiResponse<>();
          resp.setCode(1012);
          resp.setMessage("Version delete successful");
          return resp;
      }




}
