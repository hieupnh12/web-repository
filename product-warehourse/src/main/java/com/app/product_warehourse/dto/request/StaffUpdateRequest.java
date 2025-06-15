package com.app.product_warehourse.dto.request;

import com.app.product_warehourse.validation.DobConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @DobConstraint(min = 10, message = "INVALID_DOB")
    @JsonFormat(pattern = "dd-MM-yyyy")
    LocalDate birthDate;
    @Pattern(regexp = "^(0)[0-9]{10}$")
    String phoneNumber;
    @NotBlank(message = "EMAIL_NOT_BLANK")
    @Email(message = "EMAIL_INVALID")
    String email;
    boolean status;

}
