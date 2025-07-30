package com.app.product_warehourse.repository;

import com.app.product_warehourse.dto.response.*;
import com.app.product_warehourse.entity.ExportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
                COALESCE(SUM(ed.unit_price * ed.quantity), 0) AS danh_thu,
                COALESCE(SUM(id.unit_price * id.quantity), 0) AS chi_phi,
                COALESCE(SUM(ed.unit_price * ed.quantity), 0) - COALESCE(SUM(id.unit_price * id.quantity), 0) AS loi_nhuan
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
        COALESCE(SUM(id.unit_price * id.quantity), 0) AS expenses,
        COALESCE(SUM(ed.unit_price * ed.quantity), 0) AS revenue,
        COALESCE(SUM(ed.unit_price * ed.quantit), 0) - COALESCE(SUM(id.unit_price * id.quantity), 0) AS profits
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


    @Query(value = """
            SELECT
      dates.date AS Date,
      COALESCE(SUM(id.unit_price * id.quantit), 0) AS expenses,
      COALESCE(SUM(ed.unit_price * ed.quantit), 0) AS revenues,
      COALESCE(SUM(ed.unit_price * ed.quantit), 0) - COALESCE(SUM(id.unit_price * id.quantit), 0)  AS profits
    FROM (
      SELECT DATE_ADD(?1, INTERVAL c.number DAY) AS date
      FROM (
        SELECT a.number + b.number * 31 AS number
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
        ) AS a
        CROSS JOIN (
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
        ) AS b
      ) AS c
      WHERE DATE_ADD(?1, INTERVAL c.number DAY) <= ?2
    ) AS dates
    LEFT JOIN export ex ON DATE(ex.export_time) = dates.date
    LEFT JOIN export_details ed ON ex.export_id = ed.export_id
    LEFT JOIN product_item pi ON pi.export_id = ed.export_id\s
                        AND pi.product_version_id = ed.product_version_id
    LEFT JOIN import_details id ON pi.import_id = id.import_id\s
                          AND pi.product_version_id = id.product_version_id
    GROUP BY dates.date
    ORDER BY dates.date;
    """, nativeQuery = true)
    List<DateToDateResponse> getAllDateToDate(LocalDate startDate, LocalDate endDate);


    @Query(value = """
        select 	c.customer_id,
		c.customer_name,
        c.address,
		c.phone,
        count(e.export_id) as soluong,
        sum(e.total_amount) as Tongtien
        from customer c\s
        left join export e on c.customer_id = e.customer_id
        GROUP BY c.customer_id, c.customer_name;
     """, nativeQuery = true)
    List<CustomerStatisticsResponse> getCustomerStatistics();

    @Query(value = """
            WITH Imports AS (
      SELECT id.product_version_id, SUM(id.quantity) AS import_quantity
      FROM import_details id
      JOIN import i ON i.import_id = id.import_id
      WHERE i.import_time BETWEEN ?1 AND ?2
      GROUP BY id.product_version_id
    ),
    Exports AS (
      SELECT ed.product_version_id, SUM(ed.quantity) AS export_quantity
      FROM export_details ed
      JOIN export e ON e.export_id = ed.export_id
      WHERE e.export_time BETWEEN ?1 AND ?2
      GROUP BY ed.product_version_id
    ),
    BeginImport AS (
      SELECT id.product_version_id, SUM(id.quantity) AS beginning_import_quantity
      FROM import i
      JOIN import_details id ON i.import_id = id.import_id
      WHERE i.import_time < ?1
      GROUP BY id.product_version_id
    ),
    BeginExport AS (
      SELECT ed.product_version_id, SUM(ed.quantity) AS beginning_export_quantity
      FROM export e
      JOIN export_details ed ON e.export_id = ed.export_id
      WHERE e.export_time < ?1
      GROUP BY ed.product_version_id
    ),
    Beginning AS (
      SELECT
        pv.version_id,
        COALESCE(bi.beginning_import_quantity, 0) - COALESCE(be.beginning_export_quantity, 0) AS beginning_inventory
      FROM product_version pv
      LEFT JOIN BeginImport bi ON pv.version_id = bi.product_version_id
      LEFT JOIN BeginExport be ON pv.version_id = be.product_version_id
    ),
    temp_table AS (
      SELECT p.product_id, p.product_name, pv.version_id, bg.beginning_inventory,
             COALESCE(ims.import_quantity, 0) AS purchases_period,
             COALESCE(exs.export_quantity, 0) AS goods_issued,
             (bg.beginning_inventory + COALESCE(ims.import_quantity, 0) - COALESCE(exs.export_quantity, 0)) AS ending_inventory
      FROM Beginning bg
      LEFT JOIN Imports ims ON bg.version_id = ims.product_version_id
      LEFT JOIN Exports exs ON bg.version_id = exs.product_version_id
      JOIN product_version pv ON pv.version_id = bg.version_id
      JOIN product p ON pv.product_id = p.product_id
    )
    SELECT * FROM temp_table p
    WHERE p.product_name LIKE CONCAT('%', ?3, '%') OR p.version_id LIKE CONCAT('%', ?4, '%')
    ORDER BY p.product_id;
    """, nativeQuery = true)
    List<InventoryStatisticsResponse> getInventoryStatistics(
            LocalDateTime startTime ,LocalDateTime endTime,
            String productName, String productVersionId
            );








    // caí riêng của lộc



    //tinh doanh thu thang thu duoc
        @Query(value = """
            SELECT
                m.month AS month,
                COALESCE(SUM(i.unit_price * i.quantity), 0) AS expenses,
                COALESCE(SUM(x.unit_price * x.quantity), 0) AS revenues,
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
            LEFT JOIN export px
                ON MONTH(px.export_time) = m.month
                AND YEAR(px.export_time) = ?
            LEFT JOIN export_details x
                ON px.export_id = x.export_id
            LEFT JOIN product_item prIt
                ON prIt.export_id = x.export_id
                AND prIt.product_version_id = x.product_version_id
            LEFT JOIN import_details i
                ON i.import_id = prIt.import_id
                AND i.product_version_id = prIt.product_version_id
            GROUP BY m.month
            ORDER BY m.month;
        """, nativeQuery = true)
    List<MonthInYearResponse> getAllMonthInYear2(Long year);





}
