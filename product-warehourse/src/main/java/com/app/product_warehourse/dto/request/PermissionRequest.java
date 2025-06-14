package com.app.product_warehourse.dto.request;


import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionRequest {
     Long functionId;
     boolean canView;
     boolean canCreate;
     boolean canUpdate;
     boolean canDelete;
}
