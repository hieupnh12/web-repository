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
    @Column(nullable = false)
    Boolean status = true;
    @ManyToOne
    @JoinColumn(name = "role_id")
    Role role;
    @OneToOne
    @MapsId
    @JoinColumn(name = "staff_id")
    Staff staff;
}
