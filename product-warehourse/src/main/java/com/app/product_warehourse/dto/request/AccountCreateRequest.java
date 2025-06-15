package com.app.product_warehourse.dto.request;


import com.app.product_warehourse.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCreateRequest {
    @NotBlank(message = "AUTHENTICATED_USERNAME_NOT_NULL")
    @Size(min = 10, message = "INVALID_PASSWORD")
     String userName;

    @NotBlank(message = "AUTHENTICATED_PASSWORD_NOT_NULL")
    @Size(min = 8, message = "USERNAME_INVALID")
     String password;

    @NotNull(message = "Role ID cannot be null")
     Long roleId;

}
