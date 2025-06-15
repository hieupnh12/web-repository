package com.app.product_warehourse.repository;


import com.app.product_warehourse.entity.WarehouseArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseAreaRepository extends JpaRepository<WarehouseArea, Long> {

    List<WarehouseArea> findByStatusTrue();

}
