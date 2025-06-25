package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StatisticsCountsResponse {
     Long itemCount;
     Long customerCount;
     Long staffCount;
}
