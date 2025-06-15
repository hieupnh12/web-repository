package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "ram") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class Ram {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ram_id")
    Long ram_id;

    @Column(name = "ram_size")
    String name;

    @Column(name = "status",columnDefinition = "TINYINT(1)")
    Boolean status;


}
