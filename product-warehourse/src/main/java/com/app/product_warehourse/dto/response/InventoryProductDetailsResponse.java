package com.app.product_warehourse.dto.response;

import com.app.product_warehourse.enums.ProductStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryProductDetailsResponse {
    Long inventoryId;
    String imei;
    String productVersionId;
    ProductStatus status;
}
