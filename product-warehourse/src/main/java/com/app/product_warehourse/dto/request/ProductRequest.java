package com.app.product_warehourse.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
    private String productName;

    private String image;

    private Long originId;

    private String processor;

    private Integer battery;

    private Double screenSize;

    private Long operatingSystemId;

    private Integer chipset;

    private String rearCamera;

    private String frontCamera;

    private Integer warrantyPeriod;

    private Long  brandId;

    private Long  warehouseAreaId;

    private Boolean status;



    //them danh sach cac phien ban san pham
    private List<ProductVersionRequest> versions;

}
