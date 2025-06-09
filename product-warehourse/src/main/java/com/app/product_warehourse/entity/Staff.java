package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    String phoneNumber;
    String email;

    Integer status;
    @OneToOne(mappedBy = "staff", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    Account account;
}
