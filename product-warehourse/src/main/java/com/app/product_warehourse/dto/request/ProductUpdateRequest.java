package com.app.product_warehourse.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {

    // private MultipartFile image;

    private Integer origin;

    private String processor;

    private Integer battery;

    private Double screenSize;

    private Integer operatingSystem;

    private Integer chipset;

    private String rearCamera;

    private String frontCamera;

    private Integer warrantyPeriod;

    private Integer brand;

    private Integer warehouseArea;


    private Boolean status;
}
