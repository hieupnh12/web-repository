package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "product_item") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ProductItem {

    @Id
    @Column(name ="imei")
    String imei;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="product_version_id")
    ProductVersion versionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="import_id")
    ImportReceipt import_id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="export_id")
    ExportReceipt export_id;

    @Column(name ="status")
    boolean status;



}
