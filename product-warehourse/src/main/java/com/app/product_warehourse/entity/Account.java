package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Account {
    @Id
    String staffId;
    String userName;
    String password;
    Integer status;
    @ManyToOne
    Role role;
    String otp;
    @OneToOne
    @MapsId // Dùng chung khóa chính với Staff
    @JoinColumn(name = "staff_id")
    Staff staff;
}
