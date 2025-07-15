package com.app.product_warehourse.aspect;

import com.app.product_warehourse.service.ActivityLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class LoggingAspect {
    ActivityLogService activityLogService;

    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object logActivity(ProceedingJoinPoint joinPoint) throws Throwable {
        // Lấy HttpServletRequest
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes != null ? attributes.getRequest() : null;
        String ipAddress = request != null ? request.getRemoteAddr() : "unknown";

        // Lấy staffId từ Spring Security
        String staffId = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "unknown";

        // Lấy tên phương thức và tạo action
        String methodName = joinPoint.getSignature().getName().toLowerCase();
        String controllerName = joinPoint.getTarget().getClass().getSimpleName().replace("Controller", "");
        String action = mapMethodToAction(methodName, controllerName);
        String details = "Called API: " + joinPoint.getSignature().toShortString();

        // Ghi log
        try {
            activityLogService.logActivity(staffId, action, details, ipAddress);
        } catch (IllegalArgumentException e) {
            log.error("Failed to log activity: {}", e.getMessage());
        }

        // Tiếp tục thực thi phương thức
        return joinPoint.proceed();
    }

    private String mapMethodToAction(String methodName, String controllerName) {
        // Tùy chỉnh action dựa trên tên phương thức và controller
        return switch (methodName) {
            case "createproduct" -> "CREATE_PRODUCT";
            case "updateproduct" -> "UPDATE_PRODUCT";
            case "deleteproduct" -> "DELETE_PRODUCT";
            case "countproductitemin" -> "VIEW_STATISTICS_COUNT";
            case "countproductitemout" -> "VIEW_STATISTICS_OVERVIEWS";
            case "supplierstatistics" -> "VIEW_SUPPLIER_STATISTICS";
            case "productstatistics" -> "VIEW_PRODUCT_STATISTICS";
            case "monthinyearstatistics" -> "VIEW_MONTHLY_REVENUE";
            case "datestatistics" -> "VIEW_DAILY_STATISTICS";
            case "yearstatistics" -> "VIEW_YEARLY_STATISTICS";
            case "getactivitylogsbytime" -> "VIEW_ACTIVITY_LOGS_TIME";
            case "getactivitylogsbystaffid" -> "VIEW_ACTIVITY_LOGS_STAFF";
            default -> controllerName + "_" + methodName.toUpperCase();
        };
    }
}
