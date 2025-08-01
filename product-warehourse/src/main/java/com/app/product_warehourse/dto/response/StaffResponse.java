package com.app.product_warehourse.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffResponse {
    String staffId;
    String fullName;
    Boolean gender;
    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate birthDate;
    String phoneNumber;
    String email;
}
