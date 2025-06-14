package com.app.product_warehourse.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffUpdateRequest {
    String fullName;
    Boolean gender;
    String phoneNumber;
    LocalDate birthDate;
    String email;
    boolean status;

}
