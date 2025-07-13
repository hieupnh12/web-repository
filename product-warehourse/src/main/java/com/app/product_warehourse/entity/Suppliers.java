package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "supplier" )
@FieldDefaults(level = AccessLevel.PRIVATE)
public class    Suppliers {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name ="supplier_id")
    String id ;

    @Column(name = "supplier_name")
    String name ;

    @Column(name = "address")
    String address ;

    @Column(name = "email")
    String email ;

    @Column(name = "phone")
    String phone ;

    @Column(name = "status")
    Boolean status ;


}
