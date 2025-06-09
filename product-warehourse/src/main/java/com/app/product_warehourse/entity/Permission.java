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
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long permissionId;
    @ManyToOne
    Functions functions;
     boolean canView;
     boolean canCreate;
     boolean canUpdate;
     boolean canDelete;
}
