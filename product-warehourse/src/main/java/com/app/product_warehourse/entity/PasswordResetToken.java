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
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String token;

    @OneToOne
    @JoinColumn(name = "staff_id")
    Account account;

    LocalDateTime expiryTime;

    public boolean isValid() {
        return LocalDateTime.now().isBefore(expiryTime);
    }
}
