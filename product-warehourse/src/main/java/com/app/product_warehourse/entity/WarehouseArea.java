package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "warehouse_area" )
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WarehouseArea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "area_id")
    Long id;


    @Column(name ="area_name")
    String name;

    @Column(name ="note")
    String note;

    @Column(name ="status")
    boolean  status;

}
