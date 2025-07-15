package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.response.ActivityLogResponse;
import com.app.product_warehourse.entity.ActivityLog;
import com.app.product_warehourse.mapper.ActivityLogMapper;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.ActivityLogRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) //bo private final
@Slf4j
public class ActivityLogService {
    ActivityLogRepository activityLogRepository;
    AccountRepository accountRepository;
    SimpMessagingTemplate messagingTemplate;


    @Async
    @Transactional
    public void logActivity(String staffId, String action, String details, String ipAddress) {
        if (!accountRepository.existsByStaffId(staffId)) {
            throw new IllegalArgumentException("Account with staffId " + staffId + " does not exist");
        }

        ActivityLog log = new ActivityLog();
        log.setStaffId(staffId);
        log.setAction(action);
        log.setDetails(details);
        log.setIpAddress(ipAddress);
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);

        ActivityLogResponse response = mapToResponse(log);
        messagingTemplate.convertAndSend("/topic/activity/log", response);
    }

    public List<ActivityLogResponse> getLogsByStaffId(String staffId) {
        return activityLogRepository.findByStaffId(staffId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ActivityLogResponse> getLogsByTimeRange(LocalDateTime start, LocalDateTime end) {
        return activityLogRepository.findByTimestampBetween(start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ActivityLogResponse> getLogsByAction(String action) {
        return activityLogRepository.findByAction(action).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ActivityLogResponse> getLogsByStaffIdAndTimeRange(String staffId, LocalDateTime start, LocalDateTime end) {
        return activityLogRepository.findByStaffIdAndTimestampBetween(staffId, start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ActivityLogResponse mapToResponse(ActivityLog log) {
        return ActivityLogResponse.builder()
                .id(log.getId())
                .staffId(log.getStaffId())
                .action(log.getAction())
                .details(log.getDetails())
                .ipAddress(log.getIpAddress())
                .timestamp(log.getTimestamp())
                .build();
    }


}
