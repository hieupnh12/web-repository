package com.app.product_warehourse.mapper;

import com.app.product_warehourse.dto.response.ActivityLogResponse;
import com.app.product_warehourse.entity.ActivityLog;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityLogMapper {
    ActivityLogResponse activityLogToActivityLogResponse(ActivityLog activityLog);
}
