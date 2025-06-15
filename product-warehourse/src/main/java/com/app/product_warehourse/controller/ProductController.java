package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.Product;
import com.app.product_warehourse.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {
         @Autowired
        private ProductService productService;

         //tao new Product su dung Post
         @PostMapping
         public ProductResponse addProduct(@RequestBody @Valid ProductRequest request) {
             return   productService.createProduct(request);
         }

//    @PostMapping
//    public ApiResponse<ProductResponse> createProductWithVersions(@RequestBody CreateProductWithVersionsRequest request) {
//        ApiResponse<ProductResponse> resp = new ApiResponse<>();
//        resp.setResult(productService.createProductWithVersions(request));
//        return resp;
//    }





    @GetMapping
        public List<ProductResponse> getProducts() {
             return productService.getAllProducts();
         }


          @GetMapping("/{idproduct}")
           Product getProduct(@PathVariable("idproduct") Long  idproduct) {
               return productService.getProductById(idproduct);
          }


          @PutMapping("/{idproduct}")
           ProductResponse updateProduct(@PathVariable("idproduct") Long  idproduct, @RequestBody ProductRequest request) {
                  return productService.updateProduct(idproduct, request);
          }

          @DeleteMapping("/{idproduct}")
          public   void deleteProduct(@PathVariable("idproduct") Long  idproduct) {
               productService.deleteProduct(idproduct);
              System.out.println("Product deleted successfully");
          }



          //test ket hop productversion va product



    //cach 2 : su dụng trigger bang class StockQuantityInitializer
    //cach 1 : cap nhat lai stockquantity cho All Product thu cong
    @PutMapping("/update-all-stocks")
    public ApiResponse<String> updateAllProductStocks() {
        ApiResponse<String> api = new ApiResponse<>();
        api.setCode(1200);
        productService.updateAllProductStockQuantities();
        api.setMessage("ALl Product updated successfully");
        return api;
    }


}
