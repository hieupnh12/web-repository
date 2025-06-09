package com.app.product_warehourse.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionResponse {
    Long functionId;
    boolean canView;
    boolean canCreate;
    boolean canUpdate;
    boolean canDelete;
}
