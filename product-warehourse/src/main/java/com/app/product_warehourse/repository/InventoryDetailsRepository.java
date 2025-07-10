package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.ReportInventoryDetailsResponse;
import com.app.product_warehourse.entity.InventoryDetails;
import com.app.product_warehourse.entity.InventoryDetailsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface InventoryDetailsRepository extends JpaRepository<InventoryDetails, InventoryDetailsId> {
    @Query(value = """
            select * from inventory_details where inventory_id = ?
        """, nativeQuery=true)
    Set<InventoryDetails> findByInventoryId(Long inventoryId);

    @Query(value = """
        select 	i.inventory_id,\s
        		i.product_version_id,\s
        		pr.product_name,\s
                r.ram_size,\s
                ro.rom_size,\s
                c.color_name,\s
        		i.system_quantity,\s
                i.quantity, (i.system_quantity - i.quantity) as deviation,\s
                i.note
        from inventory_details i\s
        left join product_version p on i.product_version_id = p.version_id\s
        left join ram r on r.ram_id = p.ram\s
        left join rom ro on ro.rom_id = p.rom
        left join color c on c.color_id = p.color\s
        left join product pr on pr.product_id = p.product_id
        where inventory_id = ?
    """, nativeQuery = true)
    List<ReportInventoryDetailsResponse> getReportInventoryDetailsByInventoryId(Long inventoryId);

    @Modifying
    @Query("DELETE FROM InventoryDetails id WHERE id.id.inventoryId = :inventoryId")
    void deleteByInventoryId(Long inventoryId);

}
