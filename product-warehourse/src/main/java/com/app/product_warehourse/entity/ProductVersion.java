package com.app.product_warehourse.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "product_version") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ProductVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="version_id")
    String versionId;

    @ManyToOne
    @JoinColumn(name ="product_id")
    Product product;


    @ManyToOne
    @JoinColumn(name ="rom")
    Rom rom;


    @ManyToOne
    @JoinColumn(name="ram")
    Ram ram;


    @ManyToOne
    @JoinColumn(name="color")
    Color color;


    @Column(name ="import_price")
    BigDecimal importPrice;


    @Column(name ="export_price")
    BigDecimal exportPrice;

    @Column(name ="stock_quantity")
    Integer stockQuantity;


    @Column(name="status")
    Boolean status;






}
