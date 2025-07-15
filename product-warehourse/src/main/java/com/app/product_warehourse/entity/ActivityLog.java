package com.app.product_warehourse.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "staff_id", nullable = false)
    String staffId;

    @Column(name = "action", nullable = false, length = 100)
    String action;

    @Column(name = "details", columnDefinition = "TEXT")
     String details;

    @Column(name = "ip_address", length = 45)
    String ipAddress;

    @Column(name = "timestamp", nullable = false)
    LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", referencedColumnName = "staff_id", insertable = false, updatable = false)
    Account account;
}
