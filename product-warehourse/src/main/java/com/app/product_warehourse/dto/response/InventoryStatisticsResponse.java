package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryStatisticsResponse {
    Long productId;
    String productName;
    String productVersionId;
    BigDecimal beginningInventory;
    BigDecimal purchasesPeriod;
    BigDecimal goodsIssued;
    BigDecimal endingInventory;
}
