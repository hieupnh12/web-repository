package com.app.product_warehourse.dto.request;

import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffRequest {
    String fullName;
    Integer gender;
    String phoneNumber;
    String email;
}
