package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DayInMonthResponse {
    Date date;
    BigDecimal expenses;
    BigDecimal revenues;
    BigDecimal profits;
}
