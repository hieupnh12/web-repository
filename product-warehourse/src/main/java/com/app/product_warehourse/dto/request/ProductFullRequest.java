package com.app.product_warehourse.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductFullRequest {
    String productName;

    Long originId;

    String processor;

    Integer battery;

    Double screenSize;

    Long operatingSystemId;

    Integer chipset;

    String rearCamera;

    String frontCamera;

    Integer warrantyPeriod;

    Long  brandId;

    Long  warehouseAreaId;

    Boolean status;

    //them danh sach cac phien ban san pham
     List<ProductVersionRequest> versions;
}
