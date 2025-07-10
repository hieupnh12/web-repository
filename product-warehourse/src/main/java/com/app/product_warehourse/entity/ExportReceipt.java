package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "export") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ExportReceipt {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name ="export_id")
    String export_id;


    @CreationTimestamp
    @Column(name ="export_time")
    LocalDateTime exportTime;

    @Column(name ="total_amount")
    Long totalAmount;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="creater_id")
    Account staff;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="customer_id")
    Customer customer;

    @Column(name ="status")
    Integer status;

    @OneToMany(mappedBy = "newExId.export_id", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<ExportReceiptDetail> exportReceiptDetails;

}
