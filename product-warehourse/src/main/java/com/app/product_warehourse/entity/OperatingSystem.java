package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "operating_system" )
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OperatingSystem {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       @Column(name ="os_id")
       Long id;

       @Column(name="os_name")
       String name;

       @Column(name="status")
       boolean status;



}
