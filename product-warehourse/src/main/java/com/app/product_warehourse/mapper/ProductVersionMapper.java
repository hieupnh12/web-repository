package com.app.product_warehourse.mapper;


import com.app.product_warehourse.dto.request.ProductVersionRequest;
import com.app.product_warehourse.dto.response.ProductVersionResponse;
import com.app.product_warehourse.entity.Color;
import com.app.product_warehourse.entity.ProductVersion;
import com.app.product_warehourse.entity.Ram;
import com.app.product_warehourse.entity.Rom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "Spring")
public interface ProductVersionMapper {

    ProductVersion ToProductVersion (ProductVersionRequest request);

    @Mapping(source= "ram.name", target="ramName")
    @Mapping(source ="rom.rom_size", target = "romName")
    @Mapping(source = "color.name" , target="colorName")
    ProductVersionResponse ToProductVersionResponse (ProductVersion productVersion);

    default ProductVersion ToProducVersionMakeName (ProductVersionRequest request, Ram ram , Rom rom , Color color) {
        ProductVersion productVersion = ToProductVersion(request);
         productVersion.setRam(ram);
         productVersion.setRom(rom);
         productVersion.setColor(color);
         return productVersion;
    }
}
