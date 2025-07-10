package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.*;
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

    @Query(value = """
                        SELECT\s
                m.month AS month,
                COALESCE(SUM(i.unit_price * i.quantity), 0) AS expenses,
                COALESCE(SUM(x.unit_price * x.quantity), 0) AS revenue,
                COALESCE(SUM(x.unit_price * x.quantity), 0) - COALESCE(SUM(i.unit_price * i.quantity), 0) AS profit                     
                        FROM (
                SELECT 1 AS month UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 8 UNION ALL
                SELECT 9 UNION ALL
                SELECT 10 UNION ALL
                SELECT 11 UNION ALL
                SELECT 12
                        ) AS m
                        LEFT JOIN export px\s
                ON MONTH(px.export_time) = m.month\s
                AND YEAR(px.export_time) = ?
                        LEFT JOIN export_details x\s
                ON px.export_id = x.export_id
                        LEFT JOIN product_item prIt\s
                ON prIt.export_id = x.export_id\s
                AND prIt.product_version_id = x.product_version_id
                        LEFT JOIN import_details i\s
                ON i.import_id = prIt.import_id\s
                AND i.product_version_id = prIt.product_version_id
                        GROUP BY m.month
                        ORDER BY m.month;
            """, nativeQuery = true)
    List<MonthInYearResponse> getAllMonthInYear(Long year);

    @Query(value = """
    SELECT
        dates.date AS date,
        COALESCE(SUM(id.unit_price), 0) AS expenses,
        COALESCE(SUM(ed.unit_price), 0) AS revenue,
        COALESCE(SUM(ed.unit_price), 0) - COALESCE(SUM(id.unit_price), 0) AS profits
    FROM (
        SELECT DATE(:dates) + INTERVAL c.number DAY AS date
        FROM (
            SELECT 0 AS number 
            UNION ALL SELECT 1 
            UNION ALL SELECT 2 
            UNION ALL SELECT 3
            UNION ALL SELECT 4 
            UNION ALL SELECT 5 
            UNION ALL SELECT 6 
            UNION ALL SELECT 7
            UNION ALL SELECT 8 
            UNION ALL SELECT 9 
            UNION ALL SELECT 10 
            UNION ALL SELECT 11
            UNION ALL SELECT 12 
            UNION ALL SELECT 13 
            UNION ALL SELECT 14 
            UNION ALL SELECT 15
            UNION ALL SELECT 16
            UNION ALL SELECT 17 
            UNION ALL SELECT 18 
            UNION ALL SELECT 19
            UNION ALL SELECT 20 
            UNION ALL SELECT 21 
            UNION ALL SELECT 22 
            UNION ALL SELECT 23
            UNION ALL SELECT 24 
            UNION ALL SELECT 25 
            UNION ALL SELECT 26 
            UNION ALL SELECT 27
            UNION ALL SELECT 28 
            UNION ALL SELECT 29
            UNION ALL SELECT 30
        ) AS c
        WHERE DATE(:dates) + INTERVAL c.number DAY <= LAST_DAY(:dates)
    ) AS dates
    LEFT JOIN export ex
        ON DATE(ex.export_time) = dates.date
    LEFT JOIN export_details ed
        ON ex.export_id = ed.export_id
    LEFT JOIN product_item pI
        ON ed.export_id = pI.export_id
        AND ed.product_version_id = pI.product_version_id
    LEFT JOIN import_details id
        ON pI.import_id = id.import_id
        AND pI.product_version_id = id.product_version_id
    GROUP BY dates.date
    ORDER BY dates.date
""", nativeQuery = true)
    List<DayInMonthResponse> getAllDayInMonth(String dates);

    @Query(value = """
    WITH RECURSIVE years(year) AS (
      SELECT ?1
      UNION ALL
      SELECT year + 1
      FROM years
      WHERE year < ?2
    )
    SELECT\s
      years.year AS year,
      COALESCE(SUM(id.unit_price * id.quantity), 0) AS expenses,\s
      COALESCE(SUM(ex.unit_price * ex.quantity), 0) AS revenue,
      COALESCE(SUM(id.unit_price * id.quantity), 0) - COALESCE(SUM(ex.unit_price * ex.quantity), 0) AS profits
    FROM years
    LEFT JOIN export e ON YEAR(e.export_time) = years.year
    LEFT JOIN export_details ex ON e.export_id = ex.export_id
    LEFT JOIN product_item pi ON pi.export_id = ex.export_id\s
                        AND pi.product_version_id = ex.product_version_id
    LEFT JOIN import_details id ON pi.import_id = id.import_id\s
                          AND pi.product_version_id = id.product_version_id
    GROUP BY years.year
    ORDER BY years.year;
""", nativeQuery = true)
    List<YearToYearResponse> getAllYearToYear(int startYear, int endYear);
}
