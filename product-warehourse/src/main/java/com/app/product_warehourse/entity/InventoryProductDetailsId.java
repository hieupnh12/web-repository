package com.app.product_warehourse.entity;

import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Embeddable
public class InventoryProductDetailsId {
     Long inventoryId;
     String imei;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InventoryProductDetailsId that = (InventoryProductDetailsId) o;
        return inventoryId.equals(that.inventoryId) && imei.equals(that.imei);
    }

    @Override
    public int hashCode() {
        return Objects.hash(inventoryId, imei);
    }
}
