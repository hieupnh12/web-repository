package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffSelectResponse {
    String staffId;
    String fullName;
    Boolean gender;
    Date birthDate;
    String phoneNumber;
    String email;
}
