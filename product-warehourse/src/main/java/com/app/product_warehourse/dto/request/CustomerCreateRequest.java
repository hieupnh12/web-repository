package com.app.product_warehourse.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerCreateRequest {
    @NotBlank(message = "FULL_NAME_NOT_BLANK")
    String customerName;
    String address;
    @Pattern(regexp = "^(0)[0-9]{9}$", message = "PHONE_NUMBER_INVALID")
    String phone;
}
