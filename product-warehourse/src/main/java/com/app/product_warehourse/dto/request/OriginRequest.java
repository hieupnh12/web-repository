package com.app.product_warehourse.dto.request;


import com.app.product_warehourse.entity.Origin;
import com.app.product_warehourse.validation.UniqueName;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OriginRequest {


    @UniqueName(entity = Origin.class, fieldName = "name")
    String name;

    boolean status;
}
