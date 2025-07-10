package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.ImeiByAreaAndVersionResponse;
import com.app.product_warehourse.entity.InventoryProductDetails;
import com.app.product_warehourse.entity.InventoryProductDetailsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface InventoryProductDetailsRepository extends JpaRepository<InventoryProductDetails, InventoryProductDetailsId> {
    @Query(value = """
            select * from inventory_product_details where inventory_id = ?
        """, nativeQuery=true)
    Set<InventoryProductDetails> findByInventoryId(Long inventoryId);

    @Modifying
    @Query("DELETE FROM InventoryProductDetails ipd WHERE ipd.id.inventoryId = :inventoryId")
    void deleteByInventoryId(Long inventoryId);


    @Query(value = """
            select  pi.imei
    from product pr\s
    join warehouse_area w on pr.warehouse_area = w.area_id\s
    join product_version pv on pv.product_id = pr.product_id
    join product_item pi on pi.product_version_id = pv.version_id
    where w.area_id = ? and pv.version_id = ?;
    """, nativeQuery = true)
    List<ImeiByAreaAndVersionResponse> findImeiByAreaAndVersion(Integer area, String version);

}
