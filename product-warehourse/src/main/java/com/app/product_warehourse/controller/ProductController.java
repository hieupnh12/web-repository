package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.request.ProductUpdateRequest;
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

}
