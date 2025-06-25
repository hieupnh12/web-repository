package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InTheLast7DaysResponse {
    String date;
    BigDecimal revenue;
    BigDecimal expenses;
    BigDecimal profit;

//    public InTheLast7DaysResponse(java.sql.Date date, BigDecimal revenue, BigDecimal expenses, BigDecimal profit) {
//        this.date = date.toLocalDate();  // Convert từ sql.Date sang LocalDate
//        this.revenue = revenue;
//        this.expenses = expenses;
//        this.profit = profit;
//    }

}
