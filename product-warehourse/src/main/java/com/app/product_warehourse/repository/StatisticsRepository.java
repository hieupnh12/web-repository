package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.InTheLast7DaysResponse;
import com.app.product_warehourse.dto.response.ProductInfoResponse;
import com.app.product_warehourse.dto.response.SupplierStatisticsResponse;
import com.app.product_warehourse.entity.ExportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface StatisticsRepository extends JpaRepository<ExportReceipt, String> {

    @Query(value = """
        WITH RECURSIVE dates(d) AS (
            SELECT CURDATE() - INTERVAL 7 DAY
            UNION ALL
            SELECT d + INTERVAL 1 DAY
            FROM dates
            WHERE d < CURDATE()
        )
        SELECT 
            CAST(d AS CHAR) AS NGAY,
            COALESCE(SUM(ed.unit_price), 0) AS danh_thu,
            COALESCE(SUM(id.unit_price), 0) AS chi_phi,
            COALESCE(SUM(ed.unit_price), 0) - COALESCE(SUM(id.unit_price), 0) AS loi_nhuan
        FROM dates dt
        LEFT JOIN export e ON DATE(e.export_time) = dt.d
        LEFT JOIN export_details ed ON ed.export_id = e.export_id
        LEFT JOIN product_item pi ON pi.export_id = ed.export_id
        LEFT JOIN import_details id ON id.import_id = pi.import_id
            AND id.product_version_id = pi.product_version_id
        GROUP BY dt.d
        ORDER BY dt.d
        """, nativeQuery = true)
    List<InTheLast7DaysResponse> getReportInTheLast7Days();

    @Query(value = """
    select s.supplier_id, s.supplier_name, count(i.import_id) as soluong, sum(total_amount) as tongtien from supplier s\s
    left join import i on s.supplier_id = i.supplier_id
    GROUP BY s.supplier_id, s.supplier_name;
""", nativeQuery = true)
    List<SupplierStatisticsResponse> GetSupplierStatistics();

    @Query(value = """
        SELECT 
          p.product_id AS productId,
          p.product_name AS productName,
          p.image AS image,
          o.origin_name AS originName,
          b.brand_name AS brandName,
          w.area_name AS areaName
        FROM product p
        LEFT JOIN warehouse_area w ON p.warehouse_area = w.area_id
        LEFT JOIN origin o ON p.origin = o.origin_id
        LEFT JOIN brand b ON p.brand = b.brand_id
        """, nativeQuery = true)
    List<ProductInfoResponse> getAllProductInfo();
}
