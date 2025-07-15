package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ImageRequest;
import com.app.product_warehourse.dto.request.ProductFullRequest;
import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.request.ProductUpdateRequest;
import com.app.product_warehourse.dto.response.ProductFULLResponse;
import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.*;
import com.cloudinary.Cloudinary;
import org.mapstruct.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Mapper(componentModel = "spring", uses = {ProductVersionMapper.class})
public interface ProductMapper {

//    @Mapping(source = "firstname", target = "lastname")     cái này tức là cho dữ liệu của firstname giống với lastname
//    @Mapping(target = "lastname", ignore = true)       không mapping đối với lastname (tức là không đụng tới nó luôn --> null)
    @Mapping(target = "image", ignore = true) // Bỏ qua ánh xạ image, xử lý thủ công
    Product toProduct (ProductRequest request);

    @Mapping(target = "image", ignore = true) // Bỏ qua ánh xạ image, xử lý thủ công
    Product toProductV2 (ProductFullRequest request);

    @Mapping(source = "origin.name", target = "originName")
    @Mapping(source = "operatingSystem.name", target = "operatingSystemName")
    @Mapping(source = "brand.brandName", target = "brandName")
    @Mapping(source = "warehouseArea.name", target = "warehouseAreaName")
    ProductResponse toProductResponse (Product product);

    @Mapping(source = "origin.name", target = "originName")
    @Mapping(source = "operatingSystem.name", target = "operatingSystemName")
    @Mapping(source = "brand.brandName", target = "brandName")
    @Mapping(source = "warehouseArea.name", target = "warehouseAreaName")
    @Mapping(target = "productVersionResponses", source ="productVersion")
    ProductFULLResponse toProductFULLResponse (Product product);


    @Mapping(target = "image", ignore = true)
    Product toImageProduct(ImageRequest request,@Context Cloudinary cloudinary) throws IOException;




    @AfterMapping
    default void afterMapping(ImageRequest request, @MappingTarget Product product, @Context Cloudinary cloudinary) throws IOException {
        System.out.println("Processing image upload for request: " + (request != null ? request.getImage() : "null"));
        if (request != null && request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = uploadToCloudinary(request.getImage(), cloudinary);
            System.out.println("Uploaded image URL: " + imageUrl);
            product.setImage(imageUrl);
        } else {
            System.out.println("Image is null or empty, skipping upload");
        }
    }



    default String uploadToCloudinary(MultipartFile file, @Context Cloudinary cloudinary) throws IOException {
        if (file == null || file.isEmpty()) {
            System.out.println("File is null or empty");
            return null;
        }
        try {
            System.out.println("Uploading file: " + file.getOriginalFilename() + " with Cloudinary: " + cloudinary);
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of());
            String url = uploadResult.get("url").toString();
            System.out.println("Upload successful, URL: " + url);
            return url;
        } catch (Exception e) {
            System.err.println("Error during upload: " + e.getMessage());
            throw new IOException("Lỗi khi tải tệp lên Cloudinary: " + e.getMessage(), e);
        }
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

