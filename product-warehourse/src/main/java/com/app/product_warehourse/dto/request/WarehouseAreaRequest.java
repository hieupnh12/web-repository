package com.app.product_warehourse.dto.request;


import com.app.product_warehourse.entity.WarehouseArea;
import com.app.product_warehourse.validation.UniqueName;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WarehouseAreaRequest {


    @Size(min = 3, message = "WAREHOUSE_INVALID") //cho chiều dài chuổi la  3 kí tự
    @UniqueName(entity = WarehouseArea.class, fieldName = "name")
    String name;

    String note;

    boolean status;

}
