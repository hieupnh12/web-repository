package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "origin" )
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Origin {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      @Column(name ="origin_id")
      Long id;

      @Column(name ="origin_name")
      String name;

      @Column(name ="status")
      boolean status;



}
