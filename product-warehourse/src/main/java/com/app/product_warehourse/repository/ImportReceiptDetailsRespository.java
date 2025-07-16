package com.app.product_warehourse.repository;
import com.app.product_warehourse.entity.ImportReceiptDetail;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;  //giúp mã nguồn rõ ràng và dễ đọc hơn.Thay vì sử dụng ?1, ?2 (thứ tự tham số) trong câu truy vấn JPQL, @Param cho phép bạn đặt tên cụ thể cho các tham số, giúp truy vấn dễ hiểu hơn.
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
public interface ImportReceiptDetailsRespository extends JpaRepository<ImportReceiptDetail, ImportReceiptDetail.ImportReceiptDetailId> {

    @Query("SELECT ird FROM ImportReceiptDetail ird WHERE ird.newid.import_id.import_id = :importId AND ird.newid.productVersionId.versionId = :productVersionId")
    ImportReceiptDetail findByImportIdAndProductVersionId(@Param("importId") String importId, @Param("productVersionId") String productVersionId);



    @Transactional
    @Modifying
    @Query("DELETE FROM ImportReceiptDetail ird WHERE ird.newid.import_id.import_id = :importId AND ird.newid.productVersionId.versionId = :productVersionId")
    void deleteByImportIdAndProductVersionId(@Param("importId") String importId, @Param("productVersionId") String productVersionId);


//     @Query("SELECT d FROM ImportReceiptDetail d JOIN FETCH d.productItems WHERE d.newid.import_id.import_id = :importId")
//    List<ImportReceiptDetail> findByNewidImportIdImportId(@Param("importId") String importId);
@Query("SELECT d FROM ImportReceiptDetail d WHERE d.newid.productVersionId.versionId = :productVersionId")
List<ImportReceiptDetail> findDetailsByProductVersionId(String productVersionId);

}
