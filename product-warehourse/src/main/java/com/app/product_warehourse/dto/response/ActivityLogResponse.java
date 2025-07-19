package com.app.product_warehourse.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ActivityLogResponse {
    Long id;
    String staffId;
    String action;
    String details;
    String ipAddress;
    LocalDateTime timestamp;
}
