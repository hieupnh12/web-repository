package com.app.product_warehourse.entity;

import com.app.product_warehourse.enums.ProductStatus;
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
public class InventoryProductDetails {

    @EmbeddedId
    InventoryProductDetailsId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("inventoryId")
    @JoinColumn(name = "inventory_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    Inventory inventory;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("imei")
    @JoinColumn(name = "imei")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    ProductItem productItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_version_id", referencedColumnName = "version_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    ProductVersion productVersion;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    ProductStatus status;
}
