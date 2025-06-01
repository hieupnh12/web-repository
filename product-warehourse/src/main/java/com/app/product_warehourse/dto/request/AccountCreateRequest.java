package com.app.product_warehourse.dto.request;


import com.app.product_warehourse.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCreateRequest {
    @NotBlank(message = "User name cannot be blank")
     String userName;

    @NotBlank(message = "Password cannot be blank")
     String password;

    @NotNull(message = "Role ID cannot be null")
     Long roleId;

}
