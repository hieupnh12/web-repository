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
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long permissionId;
    @ManyToOne
    @JoinColumn(name = "function_id")
    Functions functions;
     boolean canView;
     boolean canCreate;
     boolean canUpdate;
     boolean canDelete;
     @ManyToMany(mappedBy = "permissions")
     Set<Role> roles;
}
