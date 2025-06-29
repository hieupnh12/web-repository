package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ImageRequest;
import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.request.ProductUpdateRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ImageResponse;
import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.Product;
import com.app.product_warehourse.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {
         @Autowired
        private ProductService productService;

         //tao new Product su dung Post
         @PostMapping
         public ApiResponse<ProductResponse>  addProduct(@RequestBody @Valid ProductRequest request) {
            ApiResponse<ProductResponse> api = new ApiResponse<>();
             ProductResponse response = productService.createProduct(request);
             api.setResult(response);
             return api;
         }


    @PutMapping(value = "/upload_image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> updateImageProduct(@PathVariable("id") Long id,
                                                           @RequestPart("image") MultipartFile image) {
        ApiResponse<ProductResponse> api = new ApiResponse<>();
        try {
            ImageRequest request = ImageRequest.builder().image(image).build();
            ProductResponse response = productService.createImageProduct(request, id);
            api.setResult(response);
            return api;
        } catch (IOException e) {
            api.setCode(500);
            api.setMessage("Lỗi khi tải hình ảnh: " + e.getMessage());
            return api;
        }
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
           ApiResponse<ProductResponse> updateProduct(@PathVariable("idproduct") Long  idproduct, @RequestBody ProductUpdateRequest request)  {

             ApiResponse<ProductResponse> api = new ApiResponse<>();
             api.setResult(productService.updateProduct(idproduct, request));
             return api;
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




    //load anh len front_end
    @PostMapping("/upload_image/{productId}")
    public ApiResponse<ImageResponse> uploadImage(@PathVariable("productId") Long productId,
                                                  @RequestParam("image") MultipartFile file)  throws IOException {
          String imageUrl = productService.uploadImage(productId,file);
          ApiResponse<ImageResponse> api = new ApiResponse<>();
          api.setCode(1200);
          api.setMessage(imageUrl);
          return api;
    }


}
