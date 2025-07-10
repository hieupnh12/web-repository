package com.app.product_warehourse.dto.response;


import java.time.LocalDateTime;

public interface ReportInventoryResponse {
    Long getInventoryId();
    String getStaffName();
    String getAreaName();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
    Integer getStatus();
}
