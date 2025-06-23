package com.app.product_warehourse.entity;


import com.app.product_warehourse.dto.response.AccountResponse;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "import") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ImportReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name ="import_id")
    String import_id;

    @CreationTimestamp
    @Column(name ="import_time")
    LocalDateTime time;


    @ManyToOne
    @JoinColumn(name ="supplier_id")
    Suppliers suppliers;

    @ManyToOne
    @JoinColumn(name ="created_id")
    Account staff;

    @Column(name ="total_amount")
    Long totalAmount;

    @Column(name ="status")
    Integer status;

}
