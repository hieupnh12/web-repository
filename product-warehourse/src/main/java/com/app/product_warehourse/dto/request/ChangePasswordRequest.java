package com.app.product_warehourse.dto.request;

import com.app.product_warehourse.validation.StrongPassword;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChangePasswordRequest {
    String oldPassword;
    @StrongPassword
    String newPassword;
}
