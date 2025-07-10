package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.ReportInventoryResponse;
import com.app.product_warehourse.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    @Query(value = """
    SELECT 
        i.inventory_id AS inventoryId,
        s.full_name AS staffName,
        w.area_name AS areaName,
        i.created_at AS createdAt,
        i.updated_at AS updatedAt,
        i.status AS status
    FROM inventory i
    LEFT JOIN staff s ON i.created_id = s.staff_id
    LEFT JOIN warehouse_area w ON i.area_id = w.area_id
    """, nativeQuery = true)
    List<ReportInventoryResponse> getInventoryReport();

    @Modifying
    @Query("DELETE FROM Inventory id WHERE id.inventoryId = :inventoryId")
    void deleteByInventoryId(Long inventoryId);
}
