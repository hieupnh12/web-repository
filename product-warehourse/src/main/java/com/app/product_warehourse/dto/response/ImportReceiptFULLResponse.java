package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;


@Data

@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportReceiptFULLResponse {
    String import_id;

    LocalDateTime time;

    String supplierName;

    String staffName;

    Long totalAmount;

    Integer status;


    List<ImportReceiptDetailsResponse> details; // Thêm trường này để chứa chi tiết tạm thời
}
