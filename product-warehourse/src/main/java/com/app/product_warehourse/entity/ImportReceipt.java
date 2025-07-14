package com.app.product_warehourse.entity;



import com.fasterxml.jackson.annotation.JsonManagedReference;
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


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="supplier_id")
    @JsonManagedReference
    Suppliers suppliers;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="created_id")
    @JsonManagedReference
    Account staff;

    @Column(name ="total_amount")
    Long totalAmount;

    @Column(name ="status")
    Integer status;


    @OneToMany(mappedBy = "newid.import_id", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    List<ImportReceiptDetail> importReceiptDetails;
}
