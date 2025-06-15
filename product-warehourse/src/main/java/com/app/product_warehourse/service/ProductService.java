package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.mapper.ProductMapper;
import com.app.product_warehourse.mapper.ProductVersionMapper;
import com.app.product_warehourse.repository.ProductRepository;
import com.app.product_warehourse.repository.ProductVersionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
    final RamService ramService;
    final RomService romService;
     final ProductVersionMapper productVersionMapper;
    final ColorService colorService;


    //sử dụng cách viết thủ công
    public ProductResponse createProduct(ProductRequest request ) {

        //lấy các id từ bảng
        Origin origin = originService.getOriginById(request.getOriginId());
        WarehouseArea wa = warehouseAreaService.getWarehouseAreaById(request.getWarehouseAreaId());


        // xu li trang thai hoat dong cua cac
        if(!wa.isStatus()){
            throw new AppException(ErrorCode.WAREHOUSE_UNAVAILABLE);
        }


        Brand br = brandService.GetBrandById(request.getBrandId());
        OperatingSystem os = operatingSystemService.getOSById(request.getOperatingSystemId());

        //xử lí mapper đối với các id  đó với product response
        Product product = productMapper.toProductWithOrigin(request,origin,os,br,wa);

        //lưu dữ liệu vào data
        productRepository.save(product);
        return productMapper.toProductResponse(product);
    }







    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }




    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(()-> new RuntimeException("Product not found"));
    }



    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        product = productMapper.toProduct(request);
       var savedProduct = productRepository.save(product);
       return productMapper.toProductResponse(savedProduct);
     }



    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }








    // cac method khong phai la CRUD


    // Phương thức tính stock_quantity cho Product
    public int calculateStockQuantity(Product product) {
        return productVersionRepository
                .findByProduct(product)
                .stream()
                .mapToInt(ProductVersion::getStockQuantity)
                .sum();
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




}
