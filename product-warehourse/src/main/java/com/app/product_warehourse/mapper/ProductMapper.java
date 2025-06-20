package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.request.ProductRequest;
import com.app.product_warehourse.dto.response.ProductResponse;
import com.app.product_warehourse.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

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



}

