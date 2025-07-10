package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryDetailsResponse {
    Long inventoryId;
    String productVersionId;
    Integer systemQuantity;
    Integer quantity;
    String note;
}
