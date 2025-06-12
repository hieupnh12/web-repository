package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.request.ProductUpdateRequest;
import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.*;
import com.app.product_warehourse.mapper.ProductMapper;
import com.app.product_warehourse.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    //sử dụng cách viết thủ công
    public ProductResponse createProduct(ProductRequest request ) {

        //lấy các id từ bảng
        Origin origin = originService.getOriginById(request.getOriginId());
        WarehouseArea wa = warehouseAreaService.getWarehouseAreaById(request.getWarehouseAreaId());
        Brand br = brandService.GetBrandById(request.getBrandId());
        OperatingSystem os = operatingSystemService.getOSById(request.getOperatingSystemId());

        //xử lí mapper đối với các id  đó với product response
        Product product = productMapper.toProductWithOrigin(request,origin,os,br,wa);


        //lưu dữ liệu vào data
        productRepository.save(product);
        return productMapper.toProductResponse(product);
          
//         product.setProductName(request.getProductName());
//         product.setImage(request.getImage());
//         product.setStatus(request.getStatus());
//         product.setStockQuantity(request.getStockQuantity());
//         product.setBattery(request.getBattery());
//         product.setRearCamera(request.getRearCamera());
//         product.setFrontCamera(request.getFrontCamera());
//         product.setScreenSize(request.getScreenSize());
//         product.setOrigin(request.getOrigin());
//         product.setChipset(request.getChipset());
//         product.setBrand(request.getBrand());
//         product.setWarrantyPeriod(request.getWarrantyPeriod());
//         product.setWarehouseArea(request.getWarehouseArea());
//         product.setProcessor(request.getProcessor());
//         product.setOperatingSystem(request.getOperatingSystem());
//        return   productRepository.save(product);
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



}
