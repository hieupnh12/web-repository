package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryResponse {
    Long inventoryId;
    String createdId;
    Long areaId;
    Byte status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    Set<InventoryDetailsResponse> inventoryDetailsList;
    Set<InventoryProductDetailsResponse> inventoryProductDetailsList;
}
