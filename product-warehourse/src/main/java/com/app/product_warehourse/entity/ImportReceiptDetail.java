package com.app.product_warehourse.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Builder                 // Tạo builder pattern giúp tạo đối tượng dễ dàng, linh hoạt
@Entity                  // Đánh dấu class này là entity, ánh xạ tới bảng trong DB
@Data                    // Tự sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor       // Tạo constructor không tham số (mặc định)
@AllArgsConstructor      // Tạo constructor với tất cả các tham số
@Table(name = "import_details") // Đặt tên bảng trong DB là "product"
@FieldDefaults(level = AccessLevel.PRIVATE) // Mặc định các biến thành private, không cần khai báo riêng
public class ImportReceiptDetail  {

    // Định nghĩa lớp Embeddable bên trong entity
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportReceiptDetailId implements Serializable {
        @ManyToOne
        @JoinColumn(name = "import_id")
        ImportReceipt id;

        @ManyToOne
        @JoinColumn(name = "product_version_id")
        ProductVersion productVersionId;
    }
    @EmbeddedId
    ImportReceiptDetailId newid;

    @Column(name ="quantity")
    @Min(value = 0, message = "Quantity must be non-negative")
    Integer quantity;


    @Column(name ="unit_price")
    Integer unitPrice;

    @Column(name ="import_type")
    Boolean type;
}
