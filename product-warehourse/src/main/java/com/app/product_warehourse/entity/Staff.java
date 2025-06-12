package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String staffId;
    String fullName;
    Integer gender;
    @Column(name = "birth_date", nullable = false)
    LocalDate birthDate;
    String phoneNumber;
    String email;
    @Column(nullable = false)
    @Builder.Default
    Boolean status = true;

    @OneToOne(mappedBy = "staff", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    Account account;
}
