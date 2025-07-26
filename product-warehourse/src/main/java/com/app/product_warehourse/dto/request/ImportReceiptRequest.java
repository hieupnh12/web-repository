package com.app.product_warehourse.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportReceiptRequest {

    String supplierId;

    @Min(value = 0, message = "Số lượng phải không âm")
    Long totalAmount;

    Integer status;

}
