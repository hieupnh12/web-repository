package com.app.product_warehourse.dto.request;


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
    String name;

    String note;

    boolean status;

}
