package com.app.product_warehourse.repository;

import com.app.product_warehourse.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByStaffId(String staffId);


    List<ActivityLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);


    List<ActivityLog> findByAction(String action);

    List<ActivityLog> findByStaffIdAndTimestampBetween(String staffId, LocalDateTime start, LocalDateTime end);

}