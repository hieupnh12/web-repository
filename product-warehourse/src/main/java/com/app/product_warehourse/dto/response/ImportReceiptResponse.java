package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportReceiptResponse {
    String import_id;


    LocalDateTime time;

    String supplierName;

    String staffName;

    Long totalAmount;

    Integer status;
}
