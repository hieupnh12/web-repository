package com.app.product_warehourse.controller;


import com.app.product_warehourse.dto.request.ImageRequest;
import com.app.product_warehourse.dto.request.ProductFullRequest;
import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.request.ProductUpdateRequest;
import com.app.product_warehourse.dto.response.ApiResponse;
import com.app.product_warehourse.dto.response.ImageResponse;
import com.app.product_warehourse.dto.response.ProductFULLResponse;
import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.Product;
import com.app.product_warehourse.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

        @PostMapping("/init")
        public ApiResponse<ProductFULLResponse> InitProduct(){
             return ApiResponse.<ProductFULLResponse>builder()
                     .result(productService.initProduct())
                     .build();
        }
    
    
    
        // Tạo mới Product với ảnh, sử dụng multipart/form-data
        @PostMapping(value="/full/confirm",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ApiResponse<ProductFULLResponse> addProduct(
                @RequestPart(value = "product") @Valid ProductFullRequest request,
                @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
            return ApiResponse.<ProductFULLResponse>builder()
                              .result(productService.createProductFull(request,image))
                              .build();
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
    ApiResponse<Page<ProductFULLResponse>> getAll( @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) { //Thêm @PageableDefault để mặc định trả về 10 bản ghi mỗi trang. Người dùng có thể truyền
        ApiResponse<Page<ProductFULLResponse>> resp = new ApiResponse<>();
        Pageable pageable = PageRequest.of(page, size);
        resp.setCode(1010);
        resp.setResult(productService.getAllProducts(pageable));
        return resp;
    }


    @GetMapping("/All")
     ApiResponse<Page<ProductFULLResponse>> getAllProduct(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<ProductFULLResponse>>builder()
                .result(productService.listAllProducts(pageable))
                .build();
    }

    @GetMapping("/{idproduct}")
    Product getProduct(@PathVariable("idproduct") Long idproduct) {
        return productService.getProductById(idproduct);
    }


    @PutMapping("/{idproduct}")
    ApiResponse<ProductResponse> updateProduct(@PathVariable("idproduct") Long idproduct, @RequestBody ProductUpdateRequest request) {

        ApiResponse<ProductResponse> api = new ApiResponse<>();
        api.setResult(productService.updateProduct(idproduct, request));
        return api;
    }


    @DeleteMapping("/{idproduct}")
    public ApiResponse<Void> deleteProduct(@PathVariable("idproduct") Long idproduct) {
        productService.deleteProduct(idproduct);
        return  ApiResponse.<Void>builder()
                .message("DELETE PRODUCT SUCCESSFULLY")
                .build();
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
                                                  @RequestParam("image") MultipartFile file) throws IOException {
        String imageUrl = productService.uploadImage(productId, file);
        ApiResponse<ImageResponse> api = new ApiResponse<>();
        api.setCode(1200);
        api.setMessage(imageUrl);
        return api;
    }


    @GetMapping("/search")
    public Page<ProductFULLResponse> searchProducts(
            @RequestParam(required = false) String brandName,
            @RequestParam(required = false) String warehouseAreaName,
            @RequestParam(required = false) String originName,
            @RequestParam(required = false) String operatingSystemName,
            @RequestParam(required = false) String productName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.SearchProduct(
                brandName, warehouseAreaName, originName, operatingSystemName, productName, pageable);
    }


    @GetMapping("/imei/{imei}")
    public ApiResponse<ProductFULLResponse> getProductByImei(@PathVariable("imei") String imei) {
        return  ApiResponse.<ProductFULLResponse>builder()
                .result(productService.GetProductByImei(imei))
                .build();
    }



    @PutMapping("/update-stock")
    public ApiResponse<Void> updateStockProduct() {
        productService.fixStock();
        return ApiResponse.<Void>builder()
                .message("UPDATE STOCK PRODUCT SUCCESSFULLY")
                .build();
    }

}
