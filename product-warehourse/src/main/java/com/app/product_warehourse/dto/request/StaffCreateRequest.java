package com.app.product_warehourse.dto.request;

import com.app.product_warehourse.validation.DobConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffCreateRequest {
    @Size(max = 100,  message = "LONG_USER_NAME")
    @NotBlank(message = "FULL_NAME_NOT_BLANK")
    String fullName;
    Boolean gender;
    @DobConstraint(min = 18, max= 61, message = "INVALID_DOB")
    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate birthDate;
    @Pattern(regexp = "^(0)[0-9]{9}$", message = "PHONE_NUMBER_INVALID")
    String phoneNumber;
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "EMAIL_INVALID")
    String email;
}
