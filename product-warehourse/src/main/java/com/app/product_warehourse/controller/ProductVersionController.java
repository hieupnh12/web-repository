package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ProductVersionRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ProductVersionResponse;
import com.app.product_warehourse.entity.Product;
import com.app.product_warehourse.service.ProductService;
import com.app.product_warehourse.service.ProductVersionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productVersion")
public class ProductVersionController {

    @Autowired
    ProductVersionService pvs;
    @Autowired
    private ProductService productService;

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




    @GetMapping("/{productId}")
    public ApiResponse<List<ProductVersionResponse>> getAll(@PathVariable("productId") Long productId) {
        ApiResponse<List<ProductVersionResponse>> resp = new ApiResponse<>();
        Product product = productService.getProductById(productId);
        resp.setCode(1010);
        resp.setResult(pvs.ListProductVersion(product));
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


      @GetMapping
      public ApiResponse<List<ProductVersionResponse>> getAllVersion() {
          ApiResponse<List<ProductVersionResponse>> resp = new ApiResponse<>();
          resp.setCode(1010);
          resp.setResult(pvs.listAll());
          return resp;
      }

}
