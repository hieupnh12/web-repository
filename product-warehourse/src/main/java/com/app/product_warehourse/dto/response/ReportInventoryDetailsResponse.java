package com.app.product_warehourse.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportInventoryDetailsResponse {
    Long inventoryId;
    String productVersionId;
    String productName;
    String ramSize;
    String romSize;
    String color;
    Integer systemQuantity;
    Integer quantity;
    Long deviation;
    String note;

}
