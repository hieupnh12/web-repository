package com.app.product_warehourse.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryUpdateRequest {
    Long areaId;
    Byte status;
    @UpdateTimestamp
    Set<InventoryDetailsRequest> inventoryDetails;
    Set<InventoryProductDetailsRequest> inventoryProductDetails;
}
