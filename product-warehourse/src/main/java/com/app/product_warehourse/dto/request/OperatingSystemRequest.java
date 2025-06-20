package com.app.product_warehourse.dto.request;


import com.app.product_warehourse.entity.OperatingSystem;
import com.app.product_warehourse.validation.UniqueName;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OperatingSystemRequest {

    @UniqueName(entity = OperatingSystem.class, fieldName = "name")
    String name;

    boolean status;

}
