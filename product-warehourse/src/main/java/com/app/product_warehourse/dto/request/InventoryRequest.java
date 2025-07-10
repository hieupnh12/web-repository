package com.app.product_warehourse.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryRequest {
    Long areaId;
    Byte status;
    Set<InventoryDetailsRequest> inventoryDetails;
    Set<InventoryProductDetailsRequest> inventoryProductDetails;
}
