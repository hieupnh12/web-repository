package com.app.product_warehourse.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffCreateRequest {
    String fullName;
    Integer gender;
    String phoneNumber;
    String email;
}
