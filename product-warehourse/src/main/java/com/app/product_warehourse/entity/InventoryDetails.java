package com.app.product_warehourse.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class InventoryDetails {
    @EmbeddedId
    InventoryDetailsId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("inventoryId")
    @JoinColumn(name = "inventory_id", referencedColumnName = "inventory_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Inventory inventory;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productVersionId")
    @JoinColumn(name = "product_version_id", referencedColumnName = "version_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    ProductVersion productVersion;

    @Column(nullable = false)
    Integer systemQuantity;

    @Column(nullable = false)
    Integer quantity;

    @Column(nullable = false)
    String note;
}
