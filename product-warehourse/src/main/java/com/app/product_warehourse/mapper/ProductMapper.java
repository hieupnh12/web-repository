package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ImageRequest;
import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.request.ProductUpdateRequest;
import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.web.multipart.MultipartFile;

@Mapper(componentModel = "spring")
public interface ProductMapper {

//    @Mapping(source = "firstname", target = "lastname")     cái này tức là cho dữ liệu của firstname giống với lastname
//    @Mapping(target = "lastname", ignore = true)       không mapping đối với lastname (tức là không đụng tới nó luôn --> null)
    @Mapping(target = "image", ignore = true) // Bỏ qua ánh xạ image, xử lý thủ công
    Product toProduct (ProductRequest request);

    @Mapping(source = "origin.name", target = "originName")
    @Mapping(source = "operatingSystem.name", target = "operatingSystemName")
    @Mapping(source = "brand.brandName", target = "brandName")
    @Mapping(source = "warehouseArea.name", target = "warehouseAreaName")
    ProductResponse toProductResponse (Product product);


    @Mapping(target = "image", source = "image", qualifiedByName = "multipartFileToString")
    Product toImageProduct(ImageRequest request);

    @Named("multipartFileToString")
    default String multipartFileToString(MultipartFile file) {
        // Bạn xử lý upload file lên Cloudinary hoặc nơi lưu trữ rồi trả về URL
        // Giả sử bạn upload thành công và lấy được URL:
        return uploadToCloudinary(file);
    }

    private static String uploadToCloudinary(MultipartFile file) {
        // Upload file và trả về URL (chỉ là ví dụ đơn giản)
        return "https://your-cloud.com/" + file.getOriginalFilename();
    }


     Product toUpdateProduct(ProductUpdateRequest request);



    // Gọi riêng để xử lý entity
    @Mapping(target = "image", ignore = true) // Bỏ qua ánh xạ image
    default Product toProductWithOrigin(ProductRequest request, Origin origin , OperatingSystem os , Brand br, WarehouseArea wa ) {
        Product product = toProduct(request);
        product.setOrigin(origin);
        product.setOperatingSystem(os);
        product.setBrand(br);
        product.setWarehouseArea(wa);
        return product;
    }

//    // Gọi riêng để xử lý entity để update
//    @Mapping(target = "image", ignore = true) // Bỏ qua ánh xạ image
//    default Product toProductUpdate(ProductUpdateRequest request, Origin origin , OperatingSystem os , Brand br, WarehouseArea wa ) {
//        Product product = toUpdateProduct(request);
//        product.setOrigin(origin);
//        product.setOperatingSystem(os);
//        product.setBrand(br);
//        product.setWarehouseArea(wa);
//        return product;
//    }


    // Phương thức mới để cập nhật đối tượng Product hiện có
    default void toProductUpdate(ProductUpdateRequest request, Product product, Origin origin, OperatingSystem os, Brand br, WarehouseArea wa) {
        if (request.getProcessor() != null) {
            product.setProcessor(request.getProcessor());
        }
        if (request.getBattery() != null) {
            product.setBattery(request.getBattery());
        }
        if (request.getScreenSize() != null) {
            product.setScreenSize(request.getScreenSize());
        }
        if (request.getChipset() != null) {
            product.setChipset(request.getChipset());
        }
        if (request.getRearCamera() != null) {
            product.setRearCamera(request.getRearCamera());
        }
        if (request.getFrontCamera() != null) {
            product.setFrontCamera(request.getFrontCamera());
        }
        if (request.getWarrantyPeriod() != null) {
            product.setWarrantyPeriod(request.getWarrantyPeriod());
        }
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        product.setOrigin(origin);
        product.setOperatingSystem(os);
        product.setBrand(br);
        product.setWarehouseArea(wa);
    }

}

