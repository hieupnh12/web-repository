package com.app.product_warehourse.dto.request;


import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.validation.StrongPassword;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCreateRequest {

    @Size(min = 6, max = 30,  message = "USERNAME_INVALID")
    @NotBlank(message = "AUTHENTICATED_USERNAME_NOT_NULL")
     String userName;

//    @NotBlank(message = "AUTHENTICATED_PASSWORD_NOT_NULL")
//    @Size(min = 8, message = "INVALID_PASSWORD"

    @StrongPassword
    String password;

    @NotNull(message = "Role ID cannot be null")
     Long roleId;

}
