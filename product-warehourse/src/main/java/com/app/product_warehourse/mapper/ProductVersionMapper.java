package com.app.product_warehourse.mapper;


import com.app.product_warehourse.dto.request.ProductVersionRequest;
import com.app.product_warehourse.dto.response.ProductVersionResponse;
import com.app.product_warehourse.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
@Mapper(componentModel = "Spring")
public interface ProductVersionMapper {

    ProductVersion ToProductVersion (ProductVersionRequest request);

    @Mapping(source= "ram.name", target="ramName")
    @Mapping(source ="rom.rom_size", target = "romName")
    @Mapping(source = "color.name" , target="colorName")
    @Mapping(source = "product.productName", target ="productName")
    ProductVersionResponse ToProductVersionResponse (ProductVersion productVersion);

    default ProductVersion ToProducVersionMakeName (ProductVersionRequest request, Ram ram , Rom rom , Color color, Product product) {
        ProductVersion productVersion = ToProductVersion(request);
         productVersion.setRam(ram);
         productVersion.setRom(rom);
         productVersion.setColor(color);
         productVersion.setProduct(product);
         return productVersion;
    }


    default ProductVersion ToUpdateProductVersion (ProductVersionRequest request, ProductVersion version ,Ram ram , Rom rom , Color color, Product product) {
        // Cập nhật các trường từ request nếu có giá trị
        if (request.getExportPrice() != null) {
            version.setExportPrice(request.getExportPrice());
        }
        if (request.getImportPrice() != null) {
            version.setImportPrice(request.getImportPrice());
        }
        if (request.getStockQuantity() != null) {
            version.setStockQuantity(request.getStockQuantity());
        }
        if (request.getStatus() != null) {
            version.setStatus(request.getStatus());
        }
        // Cập nhật các trường liên quan
        version.setRam(ram);
        version.setRom(rom);
        version.setColor(color);
        version.setProduct(product);
        return version;
    }





}
