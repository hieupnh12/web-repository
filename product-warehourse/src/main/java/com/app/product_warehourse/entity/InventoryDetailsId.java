package com.app.product_warehourse.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Embeddable
public class InventoryDetailsId implements Serializable {
    @Column(name = "inventory_id")
     Long inventoryId;
    @Column(name = "product_version_id")
     String productVersionId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InventoryDetailsId that = (InventoryDetailsId) o;
        return inventoryId.equals(that.inventoryId) && productVersionId.equals(that.productVersionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(inventoryId, productVersionId);
    }

}
