package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Getter
@Setter// Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "product_item") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ProductItem {

    @Id
    @Column(name ="imei", unique = true)
    String imei;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="product_version_id")
    @ToString.Exclude
    ProductVersion versionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="import_id")
    @ToString.Exclude
    ImportReceipt import_id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="export_id")
    @ToString.Exclude
    ExportReceipt export_id;

    @Column(name ="status")
    boolean status;



}
