package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerStatisticsResponse {
    String customerId;
    String customerName;
    String address;
    String phoneNumber;
    Long amount;
    BigDecimal totalAmount;
}
