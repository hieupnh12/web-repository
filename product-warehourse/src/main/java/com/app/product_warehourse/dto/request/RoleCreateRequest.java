package com.app.product_warehourse.dto.request;

import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Permission;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleCreateRequest {
    String name;
    Set<PermissionRequest> permissions;
}
