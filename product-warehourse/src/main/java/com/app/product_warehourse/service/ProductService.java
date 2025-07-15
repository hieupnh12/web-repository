package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ImageRequest;
import com.app.product_warehourse.dto.request.ProductFullRequest;
import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.request.ProductUpdateRequest;
import com.app.product_warehourse.dto.response.ProductFULLResponse;
import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.ProductMapper;
import com.app.product_warehourse.mapper.ProductVersionMapper;
import com.app.product_warehourse.repository.ProductRepository;
import com.app.product_warehourse.repository.ProductVersionRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor  // thay cho autowrid
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
public class ProductService {

    ProductRepository productRepository;
    ProductMapper productMapper;
    final OriginService originService;
    final WarehouseAreaService warehouseAreaService;
    final BrandService brandService;
    final OperatingSystemService operatingSystemService;
    final ProductVersionRepository productVersionRepository;
    Cloudinary cloudinary;

//     @Transactional
//     public ProductFULLResponse createProductFull(ProductFullRequest request){
//           if(request == null || request.getVersions() == null || request.getVersions().isEmpty()){
//               throw new AppException(ErrorCode.INVALID_REQUEST);
//           }
//
//         Origin origin = originService.getOriginById(request.getOriginId());
//         WarehouseArea wa = warehouseAreaService.getWarehouseAreaById(request.getWarehouseAreaId());
//
//         if (!wa.isStatus()) {
//             throw new AppException(ErrorCode.WAREHOUSE_UNAVAILABLE);
//         }
//
//         Brand br = brandService.GetBrandById(request.getBrandId());
//         OperatingSystem os = operatingSystemService.getOSById(request.getOperatingSystemId());
//
//
//
//     }












    @Transactional
    public ProductResponse createProductWithImage(ProductRequest request, MultipartFile image) throws IOException {
        Origin origin = originService.getOriginById(request.getOriginId());
        WarehouseArea wa = warehouseAreaService.getWarehouseAreaById(request.getWarehouseAreaId());

        if (!wa.isStatus()) {
            throw new AppException(ErrorCode.WAREHOUSE_UNAVAILABLE);
        }

        Brand br = brandService.GetBrandById(request.getBrandId());
        OperatingSystem os = operatingSystemService.getOSById(request.getOperatingSystemId());

        // Tạo Product với các thực thể liên quan
        Product product = productMapper.toProductWithOrigin(request, origin, os, br, wa);

        // Xử lý ảnh nếu có (sử dụng logic trong ProductMapper)
        if (image != null && !image.isEmpty()) {
            ImageRequest imageRequest = ImageRequest.builder().image(image).build();
            Product updatedProduct = productMapper.toImageProduct(imageRequest, cloudinary);
            product.setImage(updatedProduct.getImage());
        }

        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }


    @Transactional
    public ProductResponse createImageProduct(ImageRequest request, Long id) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại với ID: " + id));

        System.out.println("Processing request with image: " + (request.getImage() != null ? request.getImage().getOriginalFilename() : "null"));
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            Product updatedProduct = productMapper.toImageProduct(request, cloudinary);
            product.setImage(updatedProduct.getImage()); // Cập nhật image
            System.out.println("Updated product image: " + updatedProduct.getImage());
        } else {
            System.out.println("No image provided in request");
        }

        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }




    public Page<ProductFULLResponse> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAllWithRelations(pageable);
        return products.map(productMapper::toProductFULLResponse);
    }



    public List<ProductFULLResponse> ListAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                       .map(productMapper::toProductFULLResponse)
                       .collect(Collectors.toList());
    }



    public Product getProductById(Long id) {
        long start = System.nanoTime();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXIST));
        long end = System.nanoTime();
        log.info("getProductById took {} ms", (end - start) / 1_000_000);
        return product;
    }



    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        log.info("Nhận được ProductUpdateRequest với originId: {}", request.getOriginId());
        // Lấy sản phẩm hiện có
        Product product = getProductById(id); // Đảm bảo lấy sản phẩm với productId = 18

        // Lấy các thực thể liên quan
        Origin origin = originService.getOriginById(request.getOriginId());
        WarehouseArea wa = warehouseAreaService.getWarehouseAreaById(request.getWarehouseAreaId());
        if (!wa.isStatus()) {
            throw new AppException(ErrorCode.WAREHOUSE_UNAVAILABLE);
        }
        Brand br = brandService.GetBrandById(request.getBrandId());
        OperatingSystem os = operatingSystemService.getOSById(request.getOperatingSystemId());

        // Cập nhật các trường của sản phẩm hiện có
        productMapper.toProductUpdate(request, product, origin, os, br, wa);

        // Lưu sản phẩm đã cập nhật
        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }





    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }


    // cac method khong phai la CRUD


    // Phương thức tính stock_quantity cho Product
    public int calculateStockQuantity(Product product) {
        return productRepository.calculateStockQuantity(product);
    }


    // Phương thức cập nhật stock_quantity cho Product
    @Transactional
    public void updateProductStockQuantity(Long productId) {
        Product product = getProductById(productId);
        int totalStock = calculateStockQuantity(product);
        product.setStockQuantity(totalStock);
        productRepository.save(product);
    }


    // Phương thức mới để cập nhật stock_quantity cho tất cả Product
    @Transactional
    public void updateAllProductStockQuantities() {
        List<Product> products = productRepository.findAll();
        log.info("Bắt đầu cập nhật stock_quantity cho {} sản phẩm", products.size());
        for (Product product : products) {
            int totalStock = calculateStockQuantity(product);
            if (product.getStockQuantity() != totalStock) {
                product.setStockQuantity(totalStock);
                productRepository.save(product);
                log.info("Đã cập nhật stock_quantity cho sản phẩm ID {} thành {}", product.getProductId(), totalStock);
            }
        }
        log.info("Hoàn thành cập nhật stock_quantity cho tất cả sản phẩm");
    }


    public String uploadImage(Long id, MultipartFile file) throws IOException {

        //Kiểm tra file
        if (file.isEmpty() || !isImageFile(file)) {
            throw new IllegalArgumentException(" Invalid image file");
        }

        //Upload len Cloudinary

//        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

        // Tạo một Map chứa các tùy chọn để upload ảnh lên Cloudinary
        Map options = ObjectUtils.asMap(
                "quality", "auto",              // Tự động tối ưu chất lượng ảnh (giảm dung lượng mà vẫn đẹp)
                "fetch_format", "auto"                  // Tự động chọn định dạng file phù hợp nhất (WebP, JPEG, PNG, v.v.)
        );

// Gọi hàm upload ảnh từ Cloudinary, truyền vào:
// - file.getBytes(): nội dung file ảnh dưới dạng byte[]
// - options: các tùy chọn upload đã tạo ở trên
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

// Lấy URL an toàn (https) của ảnh vừa upload từ kết quả trả về
        String imageUrl = (String) uploadResult.get("secure_url");


        //cap nhat san pham
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setImage(imageUrl);
        productRepository.save(product);

        return imageUrl;

    }


    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (contentType.equals("image/jpeg") || contentType.equals("image/png"));
    }

}
