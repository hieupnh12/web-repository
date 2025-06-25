package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerResponse {
    String customerId;
    String customerName;
    String address;
    String phone;
    Boolean status;
    LocalDateTime joinDate;
}
